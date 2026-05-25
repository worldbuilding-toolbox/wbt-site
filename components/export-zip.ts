"use client";

import JSZip from "jszip";
import {
  buildAccountExport, buildWorldExport, downloadBlob, isoDate, slugify,
  type AccountExport, type WorldExport, type WorldBundle, type ExportFile,
} from "./export";
import { markExported, type User, type World } from "./store";

// ============================================================================
// Asset references
// ============================================================================

/**
 * Sidecar lookup for files held in the ZIP. The manifest inside the ZIP is
 * still a regular ExportFile shape — any dataUrl/imageUrl that points at
 * inline base64 gets emptied and the path inside the ZIP is recorded here.
 * Keeps the JSON-import code path 100% reusable for the manifest itself.
 */
export type ZipAssetMap = {
  articleCovers?: Record<string, string>;       // articleId → "worlds/{wid}/articles/{aid}/cover.{ext}"
  articleAttachments?: Record<string, Record<string, string>>; // articleId → attachmentId → path
  ideaImages?: Record<string, string>;          // ideaId → path
};

export type ZipManifest = (AccountExport | WorldExport) & { assets: ZipAssetMap };

const MANIFEST_FILENAME = "manifest.json";
const DATA_URL_RX = /^data:([^;]+);base64,(.+)$/;

function extFromMime(mime: string): string {
  const sub = mime.split("/")[1] || "bin";
  // Trim ";charset=..." or "+xml" tails
  return sub.split(";")[0].split("+")[0] || "bin";
}

function dataUrlToBlob(dataUrl: string): { blob: Blob; ext: string } | null {
  const m = dataUrl.match(DATA_URL_RX);
  if (!m) return null;
  const [, mime, b64] = m;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { blob: new Blob([bytes], { type: mime }), ext: extFromMime(mime) };
}

/**
 * Walk a world bundle, replace inline data: URLs with ZIP paths, record
 * those paths in the asset map, and stash the binary into the zip.
 * Returns a new bundle (originals untouched) suitable for the manifest.
 */
function externaliseAssets(bundle: WorldBundle, zip: JSZip, assets: ZipAssetMap): WorldBundle {
  const wid = bundle.world.id;

  const articles = bundle.articles.map((article) => {
    const aid = article.id;

    // Cover image
    let imageUrl = article.imageUrl;
    if (article.imageUrl && DATA_URL_RX.test(article.imageUrl)) {
      const decoded = dataUrlToBlob(article.imageUrl);
      if (decoded) {
        const path = `worlds/${wid}/articles/${aid}/cover.${decoded.ext}`;
        zip.file(path, decoded.blob);
        (assets.articleCovers ??= {})[aid] = path;
        imageUrl = undefined;
      }
    }

    // Attachments
    const attachments = article.attachments.map((att) => {
      if (!att.dataUrl || !DATA_URL_RX.test(att.dataUrl)) return att;
      const decoded = dataUrlToBlob(att.dataUrl);
      if (!decoded) return att;
      const ext = att.ext || decoded.ext;
      const path = `worlds/${wid}/articles/${aid}/attachments/${att.id}.${ext}`;
      zip.file(path, decoded.blob);
      const articleMap = ((assets.articleAttachments ??= {})[aid] ??= {});
      articleMap[att.id] = path;
      return { ...att, dataUrl: undefined };
    });

    return { ...article, imageUrl, attachments };
  });

  const ideas = bundle.ideas.map((idea) => {
    if (!idea.imageUrl || !DATA_URL_RX.test(idea.imageUrl)) return idea;
    const decoded = dataUrlToBlob(idea.imageUrl);
    if (!decoded) return idea;
    const path = `worlds/${wid}/ideas/${idea.id}/image.${decoded.ext}`;
    zip.file(path, decoded.blob);
    (assets.ideaImages ??= {})[idea.id] = path;
    return { ...idea, imageUrl: undefined };
  });

  return { ...bundle, articles, ideas };
}

// ============================================================================
// Build + download
// ============================================================================

async function buildZip(input: ExportFile): Promise<Blob> {
  const zip = new JSZip();
  const assets: ZipAssetMap = {};

  let manifest: ZipManifest;
  if (input.scope === "account") {
    const worlds = input.worlds.map((b) => externaliseAssets(b, zip, assets));
    manifest = { ...input, worlds, assets };
  } else {
    const world = externaliseAssets(input.world, zip, assets);
    manifest = { ...input, world, assets };
  }

  zip.file(MANIFEST_FILENAME, JSON.stringify(manifest, null, 2));
  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}

export async function exportAccountZip(user: User): Promise<void> {
  const blob = await buildZip(buildAccountExport(user));
  downloadBlob(blob, `worldbuilding-toolbox-${isoDate()}.zip`);
  markExported();
}

export async function exportWorldZip(world: World): Promise<void> {
  const blob = await buildZip(buildWorldExport(world));
  downloadBlob(blob, `world-${slugify(world.name)}-${isoDate()}.zip`);
  markExported();
}
