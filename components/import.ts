"use client";

import {
  addWorld, deleteWorld, getWorlds,
  saveEras, saveEvents, saveArticles, saveIdeas, saveHelpArticles,
  type World,
} from "./store";
import {
  EXPORT_APP_NAME, EXPORT_SCHEMA_VERSION,
  type AccountExport, type ExportFile, type WorldBundle, type WorldExport,
} from "./export";

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
