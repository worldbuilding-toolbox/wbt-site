"use client";

import {
  getWorlds, getEras, getEvents, getArticles, getIdeas, getHelpArticles,
  type User, type World, type Era, type TimelineEvent, type Article, type Idea, type UserHelpArticle,
} from "./store";

export const EXPORT_SCHEMA_VERSION = 1 as const;
export const EXPORT_APP_NAME = "worldbuilding-toolbox" as const;

export type WorldBundle = {
  world: World;
  eras: Era[];
  events: TimelineEvent[];
  articles: Article[];
  ideas: Idea[];
  help: UserHelpArticle[];
};

export type AccountExport = {
  schemaVersion: typeof EXPORT_SCHEMA_VERSION;
  scope: "account";
  app: typeof EXPORT_APP_NAME;
  exportedAt: string;
  user: { id: string; name: string; email: string };
  worlds: WorldBundle[];
};

export type WorldExport = {
  schemaVersion: typeof EXPORT_SCHEMA_VERSION;
  scope: "world";
  app: typeof EXPORT_APP_NAME;
  exportedAt: string;
  world: WorldBundle;
};

export type ExportFile = AccountExport | WorldExport;

function bundleWorld(world: World): WorldBundle {
  return {
    world,
    eras: getEras(world.id),
    events: getEvents(world.id),
    articles: getArticles(world.id),
    ideas: getIdeas(world.id),
    help: getHelpArticles(world.id),
  };
}

export function buildAccountExport(user: User): AccountExport {
  return {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    scope: "account",
    app: EXPORT_APP_NAME,
    exportedAt: new Date().toISOString(),
    user: { id: user.id, name: user.name, email: user.email },
    worlds: getWorlds(user.id).map(bundleWorld),
  };
}

export function buildWorldExport(world: World): WorldExport {
  return {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    scope: "world",
    app: EXPORT_APP_NAME,
    exportedAt: new Date().toISOString(),
    world: bundleWorld(world),
  };
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "world";
}

function isoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadJson(data: ExportFile, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  downloadBlob(blob, filename);
}

export function exportAccount(user: User): AccountExport {
  const data = buildAccountExport(user);
  downloadJson(data, `worldbuilding-toolbox-${isoDate()}.json`);
  return data;
}

export function exportWorld(world: World): WorldExport {
  const data = buildWorldExport(world);
  downloadJson(data, `world-${slugify(world.name)}-${isoDate()}.json`);
  return data;
}
