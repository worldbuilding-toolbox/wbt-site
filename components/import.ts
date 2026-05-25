"use client";

import JSZip from "jszip";
import {
  addWorld, deleteWorld, getWorlds,
  saveEras, saveEvents, saveArticles, saveIdeas, saveHelpArticles,
  type World,
} from "./store";
import {
  EXPORT_APP_NAME, EXPORT_SCHEMA_VERSION,
  type AccountExport, type ExportFile, type WorldBundle, type WorldExport,
} from "./export";
import type { ZipAssetMap, ZipManifest } from "./export-zip";

export class ImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImportError";
  }
}

export function parseExportFile(text: string): ExportFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ImportError("That file isn't valid JSON.");
  }
  if (!parsed || typeof parsed !== "object") {
    throw new ImportError("That file is empty or malformed.");
  }
  const obj = parsed as Record<string, unknown>;
  if (obj.app !== EXPORT_APP_NAME) {
    throw new ImportError("This doesn't look like a Worldbuilding Toolbox export.");
  }
  if (obj.schemaVersion !== EXPORT_SCHEMA_VERSION) {
    throw new ImportError(`Unknown schema version (${String(obj.schemaVersion)}). This file was made by a newer or older version of the app.`);
  }
  if (obj.scope === "account") {
    if (!Array.isArray((obj as AccountExport).worlds)) {
      throw new ImportError("Account export is missing the worlds list.");
    }
    return obj as AccountExport;
  }
  if (obj.scope === "world") {
    if (!(obj as WorldExport).world?.world?.id) {
      throw new ImportError("World export is missing world data.");
    }
    return obj as WorldExport;
  }
  throw new ImportError(`Unknown export scope: ${String(obj.scope)}.`);
}

/**
 * Rebuild a world bundle with fresh IDs so it can land alongside existing
 * data without colliding. Event→era references are remapped via a per-import
 * id map; everything else gets a fresh UUID.
 */
function regenerateBundleIds(bundle: WorldBundle, userId: string): WorldBundle {
  const newWorldId = crypto.randomUUID();
  const eraIdMap = new Map<string, string>();
  const eras = bundle.eras.map((e) => {
    const newId = crypto.randomUUID();
    eraIdMap.set(e.id, newId);
    return { ...e, id: newId, worldId: newWorldId };
  });
  const events = bundle.events.map((ev) => ({
    ...ev,
    id: crypto.randomUUID(),
    worldId: newWorldId,
    eraId: eraIdMap.get(ev.eraId) ?? ev.eraId,
  }));
  const articles = bundle.articles.map((a) => ({
    ...a,
    id: crypto.randomUUID(),
    worldId: newWorldId,
  }));
  const ideas = bundle.ideas.map((i) => ({
    ...i,
    id: crypto.randomUUID(),
    worldId: newWorldId,
  }));
  const help = bundle.help.map((h) => ({
    ...h,
    id: `user-${crypto.randomUUID()}`,
  }));
  return {
    world: { ...bundle.world, id: newWorldId, userId },
    eras, events, articles, ideas, help,
  };
}

/**
 * Insert a single world bundle as a brand-new world owned by `userId`.
 * Returns the newly-created World row so callers can navigate to it.
 */
export function importWorldBundle(bundle: WorldBundle, userId: string): World {
  const fresh = regenerateBundleIds(bundle, userId);
  addWorld(fresh.world);
  saveEras(fresh.world.id, fresh.eras);
  saveEvents(fresh.world.id, fresh.events);
  saveArticles(fresh.world.id, fresh.articles);
  saveIdeas(fresh.world.id, fresh.ideas);
  saveHelpArticles(fresh.world.id, fresh.help);
  return fresh.world;
}

/**
 * Destructive: removes every world this user currently owns and replaces
 * them with the bundles in the export file. Returns the imported worlds.
 */
export function importAccount(payload: AccountExport, userId: string): World[] {
  for (const w of getWorlds(userId)) {
    deleteWorld(w.id);
  }
  return payload.worlds.map((b) => importWorldBundle(b, userId));
}

export type ImportSummary = {
  worlds: number;
  eras: number;
  events: number;
  articles: number;
  ideas: number;
  help: number;
};

function summariseBundle(b: WorldBundle): ImportSummary {
  return {
    worlds: 1,
    eras: b.eras.length,
    events: b.events.length,
    articles: b.articles.length,
    ideas: b.ideas.length,
    help: b.help.length,
  };
}

/**
 * Read a ZIP export, rehydrate every external asset back into the inline
 * dataUrl form the rest of the codebase already understands, and return
 * an ExportFile suitable for the normal importWorldBundle / importAccount
 * code path.
 */
export async function parseZipFile(file: File | Blob): Promise<ExportFile> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    throw new ImportError("That ZIP file couldn't be opened.");
  }
  const manifestEntry = zip.file("manifest.json");
  if (!manifestEntry) {
    throw new ImportError("ZIP is missing manifest.json — is this a Worldbuilding Toolbox export?");
  }
  const text = await manifestEntry.async("string");
  const manifest = parseExportFile(text) as ZipManifest;
  const assets: ZipAssetMap = (manifest as ZipManifest).assets ?? {};

  const rehydrateBundle = async (b: WorldBundle): Promise<WorldBundle> => {
    const articles = await Promise.all(b.articles.map(async (article) => {
      const coverPath = assets.articleCovers?.[article.id];
      let imageUrl = article.imageUrl;
      if (coverPath) imageUrl = await loadDataUrl(zip, coverPath);

      const attachmentPaths = assets.articleAttachments?.[article.id] ?? {};
      const attachments = await Promise.all(article.attachments.map(async (att) => {
        const path = attachmentPaths[att.id];
        if (!path) return att;
        const dataUrl = await loadDataUrl(zip, path);
        return { ...att, dataUrl };
      }));

      return { ...article, imageUrl, attachments };
    }));

    const ideas = await Promise.all(b.ideas.map(async (idea) => {
      const path = assets.ideaImages?.[idea.id];
      if (!path) return idea;
      const dataUrl = await loadDataUrl(zip, path);
      return { ...idea, imageUrl: dataUrl };
    }));

    return { ...b, articles, ideas };
  };

  if (manifest.scope === "account") {
    const worlds = await Promise.all(manifest.worlds.map(rehydrateBundle));
    const rebuilt: AccountExport = { ...manifest, worlds };
    delete (rebuilt as Partial<ZipManifest>).assets;
    return rebuilt;
  } else {
    const world = await rehydrateBundle(manifest.world);
    const rebuilt: WorldExport = { ...manifest, world };
    delete (rebuilt as Partial<ZipManifest>).assets;
    return rebuilt;
  }
}

const MIME_BY_EXT: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
  webp: "image/webp", svg: "image/svg+xml", bmp: "image/bmp", avif: "image/avif",
  pdf: "application/pdf",
  txt: "text/plain", md: "text/markdown", json: "application/json",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  zip: "application/zip",
};

function mimeFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return MIME_BY_EXT[ext] ?? "application/octet-stream";
}

async function loadDataUrl(zip: JSZip, path: string): Promise<string | undefined> {
  const entry = zip.file(path);
  if (!entry) return undefined;
  const buf = await entry.async("arraybuffer");
  const blob = new Blob([buf], { type: mimeFromPath(path) });
  return await blobToDataUrl(blob);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

/** Convenience: route a File from <input type="file"> to JSON or ZIP parser. */
export async function parseImportFile(file: File): Promise<ExportFile> {
  const isZip = file.type === "application/zip"
    || file.type === "application/x-zip-compressed"
    || file.name.toLowerCase().endsWith(".zip");
  if (isZip) return parseZipFile(file);
  return parseExportFile(await file.text());
}

export function summarise(file: ExportFile): ImportSummary {
  if (file.scope === "world") return summariseBundle(file.world);
  const totals: ImportSummary = { worlds: 0, eras: 0, events: 0, articles: 0, ideas: 0, help: 0 };
  for (const b of file.worlds) {
    const s = summariseBundle(b);
    totals.worlds += s.worlds;
    totals.eras += s.eras;
    totals.events += s.events;
    totals.articles += s.articles;
    totals.ideas += s.ideas;
    totals.help += s.help;
  }
  return totals;
}
