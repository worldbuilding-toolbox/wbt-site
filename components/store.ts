"use client";

// ============================================================================
// Data types
// ============================================================================

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

export type World = {
  id: string;
  userId: string;
  name: string;
  genre: string;
  tagline: string;
  color: string;
  eraLabel: string;    // "Era" | "Age" | "Cycle" | "Reign" | "Saga" or custom
  negLabel: string;    // e.g. "BCE"
  posLabel: string;    // e.g. "AD"
  cover: string;       // CSS gradient
  createdAt: string;
};

export type Era = {
  id: string;
  worldId: string;
  name: string;
  shortLabel: string;  // e.g. "SVF", "BCE" — shown after era-relative years
  from: number;        // absolute year (can be negative)
  to: number;
  color: string;
};

export type TimelineEvent = {
  id: string;
  worldId: string;
  eraYear: number;     // year relative to era start (0 = era began)
  title: string;
  desc: string;
  kind: string;
  eraId: string;
  place?: string;
};

export type Fact = { k: string; v: string; linked?: boolean };

export type BodyBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "date"; label: string; value: string }
  | { type: "conversion"; from: string; to: string; rate: string };

export type Attachment = {
  id: string;
  name: string;
  label: string;
  ext: string;
  size: string;
  dataUrl?: string;
};

export type Article = {
  id: string;
  worldId: string;
  title: string;
  subtitle: string;
  tagline: string;
  kind: string;
  color: string;
  imageUrl?: string;
  facts: Fact[];
  body: BodyBlock[];
  attachments: Attachment[];
  links: string[];
  updatedAt: string;
};

export type Idea = {
  id: string;
  worldId: string;
  title: string;
  note: string;
  imageUrl?: string;
  glyph: string;
  color: string;
  captured: string;
  filed: boolean;
  section?: string;
};

export type HelpBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "video"; title: string; url?: string; source: string }
  | { type: "image"; caption: string };

export type HelpArticle = {
  id: string;
  title: string;
  category: string;
  icon: string;
  minutes: number;
  lede: string;
  editable: boolean;
  body: HelpBlock[];
  next: string[];
};

export type UserHelpArticle = HelpArticle & { isUserCreated?: boolean };

// ============================================================================
// Storage helpers
// ============================================================================

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ============================================================================
// Snapshot ring — 3 deep, debounced, rotated by age
// ============================================================================

const SNAPSHOT_ROTATE_MS = 30 * 60 * 1000;   // promote slot 0 → 1 after 30 min
const SNAPSHOT_DEBOUNCE_MS = 2000;            // wait 2s after the last write

export type SnapshotBundle = {
  world: World;
  eras: Era[];
  events: TimelineEvent[];
  articles: Article[];
  ideas: Idea[];
  help: UserHelpArticle[];
};

export type SnapshotEnvelope = {
  ts: string;          // last write into this slot
  rotatedAt: string;   // when slot 0 last accepted a rotation
  worldId: string;
  bundle: SnapshotBundle;
};

const snapshotTimers = new Map<string, ReturnType<typeof setTimeout>>();

function snapKey(worldId: string, slot: 0 | 1 | 2) {
  return `wbt:snapshot:${worldId}:${slot}`;
}

function captureSnapshot(worldId: string) {
  if (typeof window === "undefined") return;
  const world = load<World[]>("wbt:worlds", []).find((w) => w.id === worldId);
  if (!world) return;

  const bundle: SnapshotBundle = {
    world,
    eras: getEras(worldId),
    events: getEvents(worldId),
    articles: getArticles(worldId),
    ideas: getIdeas(worldId),
    help: getHelpArticles(worldId),
  };
  const now = new Date().toISOString();

  // Decide whether to rotate. Read slot 0; if its rotatedAt is older than the
  // rotate window, promote 1→2 and 0→1 before overwriting slot 0.
  const slot0Raw = localStorage.getItem(snapKey(worldId, 0));
  let rotatedAt = now;
  if (slot0Raw) {
    try {
      const prev = JSON.parse(slot0Raw) as SnapshotEnvelope;
      const ageMs = Date.now() - new Date(prev.rotatedAt).getTime();
      if (ageMs > SNAPSHOT_ROTATE_MS) {
        const slot1Raw = localStorage.getItem(snapKey(worldId, 1));
        if (slot1Raw) localStorage.setItem(snapKey(worldId, 2), slot1Raw);
        localStorage.setItem(snapKey(worldId, 1), slot0Raw);
      } else {
        rotatedAt = prev.rotatedAt;
      }
    } catch {
      // fall through: corrupt slot, just overwrite
    }
  }

  try {
    const env: SnapshotEnvelope = { ts: now, rotatedAt, worldId, bundle };
    localStorage.setItem(snapKey(worldId, 0), JSON.stringify(env));
  } catch {
    // Likely QuotaExceededError. Drop the oldest snapshot rings for OTHER
    // worlds to make room, then retry once.
    pruneSnapshotsForRoom();
    try {
      const env: SnapshotEnvelope = { ts: now, rotatedAt, worldId, bundle };
      localStorage.setItem(snapKey(worldId, 0), JSON.stringify(env));
    } catch {
      // Give up silently — user data is still in the live keys.
    }
  }
}

function pruneSnapshotsForRoom() {
  if (typeof window === "undefined") return;
  // Find every snapshot slot 2 (oldest) and drop them.
  for (const k of Object.keys(localStorage)) {
    if (/^wbt:snapshot:[^:]+:2$/.test(k)) localStorage.removeItem(k);
  }
}

function scheduleSnapshot(worldId: string) {
  if (typeof window === "undefined") return;
  const existing = snapshotTimers.get(worldId);
  if (existing) clearTimeout(existing);
  snapshotTimers.set(worldId, setTimeout(() => {
    snapshotTimers.delete(worldId);
    captureSnapshot(worldId);
  }, SNAPSHOT_DEBOUNCE_MS));
}

export function getSnapshots(worldId: string): SnapshotEnvelope[] {
  if (typeof window === "undefined") return [];
  const out: SnapshotEnvelope[] = [];
  for (const slot of [0, 1, 2] as const) {
    const raw = localStorage.getItem(snapKey(worldId, slot));
    if (!raw) continue;
    try {
      out.push(JSON.parse(raw) as SnapshotEnvelope);
    } catch { /* skip corrupt */ }
  }
  return out.sort((a, b) => b.ts.localeCompare(a.ts));
}

function clearSnapshots(worldId: string) {
  if (typeof window === "undefined") return;
  for (const slot of [0, 1, 2] as const) {
    localStorage.removeItem(snapKey(worldId, slot));
  }
}

// ============================================================================
// Trash (soft-delete) — 30 day TTL
// ============================================================================

const TRASH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type TrashEntry =
  | { id: string; deletedAt: string; kind: "world"; worldId: string; world: World; eras: Era[]; events: TimelineEvent[]; articles: Article[]; ideas: Idea[]; help: UserHelpArticle[] }
  | { id: string; deletedAt: string; kind: "era"; worldId: string; payload: Era }
  | { id: string; deletedAt: string; kind: "event"; worldId: string; payload: TimelineEvent }
  | { id: string; deletedAt: string; kind: "article"; worldId: string; payload: Article }
  | { id: string; deletedAt: string; kind: "idea"; worldId: string; payload: Idea };

function trashKey(userId: string) {
  return `wbt:trash:${userId}`;
}

function newTrashId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `tr-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function pruneExpired(entries: TrashEntry[]): TrashEntry[] {
  const cutoff = Date.now() - TRASH_TTL_MS;
  return entries.filter((e) => new Date(e.deletedAt).getTime() >= cutoff);
}

export function getTrash(userId: string): TrashEntry[] {
  const raw = load<TrashEntry[]>(trashKey(userId), []);
  const live = pruneExpired(raw);
  if (live.length !== raw.length) save(trashKey(userId), live);
  return [...live].sort((a, b) => b.deletedAt.localeCompare(a.deletedAt));
}

type TrashEntryInput = TrashEntry extends infer T
  ? T extends { id: string; deletedAt: string }
    ? Omit<T, "id" | "deletedAt">
    : never
  : never;

function pushTrash(userId: string, entry: TrashEntryInput): string {
  const id = newTrashId();
  const full = { ...entry, id, deletedAt: new Date().toISOString() } as TrashEntry;
  const existing = load<TrashEntry[]>(trashKey(userId), []);
  save(trashKey(userId), pruneExpired([full, ...existing]));
  return id;
}

export function purgeTrash(userId: string, entryId: string) {
  const existing = load<TrashEntry[]>(trashKey(userId), []);
  save(trashKey(userId), existing.filter((e) => e.id !== entryId));
}

export function clearTrash(userId: string) {
  save(trashKey(userId), []);
}

/**
 * Restore a trash entry. Child entities (era/event/article/idea) only restore
 * if their parent world still exists; otherwise the call is a no-op and the
 * entry is kept so the user can still restore by recreating the world.
 *
 * Returns:
 *   { ok: true }      restore succeeded
 *   { ok: false, reason } restore couldn't proceed
 */
export function restoreFromTrash(userId: string, entryId: string): { ok: true } | { ok: false; reason: string } {
  const existing = load<TrashEntry[]>(trashKey(userId), []);
  const entry = existing.find((e) => e.id === entryId);
  if (!entry) return { ok: false, reason: "Entry not found" };

  if (entry.kind === "world") {
    addWorld(entry.world);
    saveEras(entry.world.id, entry.eras);
    saveEvents(entry.world.id, entry.events);
    saveArticles(entry.world.id, entry.articles);
    saveIdeas(entry.world.id, entry.ideas);
    saveHelpArticles(entry.world.id, entry.help);
    purgeTrash(userId, entryId);
    return { ok: true };
  }

  // Child entity — parent world must still exist
  const parent = load<World[]>("wbt:worlds", []).find((w) => w.id === entry.worldId);
  if (!parent) {
    return { ok: false, reason: "The world this belonged to has been deleted too — restore it first." };
  }
  switch (entry.kind) {
    case "era":
      saveEras(entry.worldId, [...getEras(entry.worldId), entry.payload]);
      break;
    case "event":
      saveEvents(entry.worldId, [...getEvents(entry.worldId), entry.payload]);
      break;
    case "article":
      saveArticles(entry.worldId, [...getArticles(entry.worldId), entry.payload]);
      break;
    case "idea":
      saveIdeas(entry.worldId, [...getIdeas(entry.worldId), entry.payload]);
      break;
  }
  purgeTrash(userId, entryId);
  return { ok: true };
}

// ============================================================================
// Soft-delete wrappers — push to trash, then remove from live store
// ============================================================================

function currentUserId(): string | null {
  return getCurrentUser()?.id ?? null;
}

export function softDeleteWorld(worldId: string): string | null {
  const userId = currentUserId();
  if (!userId) return null;
  const world = load<World[]>("wbt:worlds", []).find((w) => w.id === worldId);
  if (!world) return null;
  const id = pushTrash(userId, {
    kind: "world",
    worldId,
    world,
    eras: getEras(worldId),
    events: getEvents(worldId),
    articles: getArticles(worldId),
    ideas: getIdeas(worldId),
    help: getHelpArticles(worldId),
  });
  deleteWorld(worldId);
  return id;
}

export function softDeleteEra(worldId: string, eraId: string): string | null {
  const userId = currentUserId();
  if (!userId) return null;
  const eras = getEras(worldId);
  const era = eras.find((e) => e.id === eraId);
  if (!era) return null;
  const id = pushTrash(userId, { kind: "era", worldId, payload: era });
  saveEras(worldId, eras.filter((e) => e.id !== eraId));
  return id;
}

export function softDeleteEvent(worldId: string, eventId: string): string | null {
  const userId = currentUserId();
  if (!userId) return null;
  const events = getEvents(worldId);
  const ev = events.find((e) => e.id === eventId);
  if (!ev) return null;
  const id = pushTrash(userId, { kind: "event", worldId, payload: ev });
  saveEvents(worldId, events.filter((e) => e.id !== eventId));
  return id;
}

export function softDeleteArticle(worldId: string, articleId: string): string | null {
  const userId = currentUserId();
  if (!userId) return null;
  const articles = getArticles(worldId);
  const article = articles.find((a) => a.id === articleId);
  if (!article) return null;
  const id = pushTrash(userId, { kind: "article", worldId, payload: article });
  saveArticles(worldId, articles.filter((a) => a.id !== articleId));
  return id;
}

export function softDeleteIdea(worldId: string, ideaId: string): string | null {
  const userId = currentUserId();
  if (!userId) return null;
  const ideas = getIdeas(worldId);
  const idea = ideas.find((i) => i.id === ideaId);
  if (!idea) return null;
  const id = pushTrash(userId, { kind: "idea", worldId, payload: idea });
  saveIdeas(worldId, ideas.filter((i) => i.id !== ideaId));
  return id;
}

export function restoreLast(trashId: string): { ok: true } | { ok: false; reason: string } {
  const userId = currentUserId();
  if (!userId) return { ok: false, reason: "Not signed in." };
  return restoreFromTrash(userId, trashId);
}

// ============================================================================
// Export reminder
// ============================================================================

export function getLastExportAt(): string | null {
  return load<string | null>("wbt:lastExportAt", null);
}

export function markExported() {
  save("wbt:lastExportAt", new Date().toISOString());
  save("wbt:nudgeDismissedUntil", null);
}

export function getNudgeDismissedUntil(): string | null {
  return load<string | null>("wbt:nudgeDismissedUntil", null);
}

export function dismissNudge(days: number) {
  const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  save("wbt:nudgeDismissedUntil", until);
}

// ============================================================================
// Auth
// ============================================================================

function hashPassword(pw: string): string {
  // Simple hash — not for production
  let hash = 0;
  for (let i = 0; i < pw.length; i++) {
    hash = ((hash << 5) - hash) + pw.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

export function getUsers(): User[] { return load<User[]>("wbt:users", []); }
export function getCurrentUser(): User | null { return load<User | null>("wbt:currentUser", null); }

export function signUp(name: string, email: string, password: string): User | string {
  const users = getUsers();
  if (users.find((u) => u.email === email)) return "An account with that email already exists.";
  const user: User = { id: crypto.randomUUID(), name, email, passwordHash: hashPassword(password) };
  save("wbt:users", [...users, user]);
  save("wbt:currentUser", user);
  return user;
}

export function signIn(email: string, password: string): User | string {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return "No account found with that email.";
  if (user.passwordHash !== hashPassword(password)) return "Incorrect password.";
  save("wbt:currentUser", user);
  return user;
}

export function signOut() {
  localStorage.removeItem("wbt:currentUser");
}

// ============================================================================
// Worlds
// ============================================================================

const ERA_COLORS = ["#7fdbff", "#6ad6a3", "#f0b860", "#e86464", "#a06a1d", "#7a2e2a"];
const WORLD_COVERS = [
  "linear-gradient(135deg, #0b0e14 0%, #11151d 50%, #0d1219 100%)",
  "linear-gradient(135deg, #0b0e14 0%, #131924 50%, #0b1220 100%)",
  "linear-gradient(135deg, #060810 0%, #0e1520 50%, #0b0e14 100%)",
];

export function getWorlds(userId: string): World[] {
  return load<World[]>("wbt:worlds", []).filter((w) => w.userId === userId);
}

export function createWorld(userId: string, name: string, genre: string, tagline: string): World {
  const worlds = load<World[]>("wbt:worlds", []);
  const world: World = {
    id: crypto.randomUUID(),
    userId,
    name,
    genre: genre || "Science Fiction",
    tagline: tagline || "",
    color: ERA_COLORS[worlds.length % ERA_COLORS.length],
    eraLabel: "Era",
    negLabel: "BF",
    posLabel: "AF",
    cover: WORLD_COVERS[worlds.length % WORLD_COVERS.length],
    createdAt: new Date().toISOString(),
  };
  save("wbt:worlds", [...worlds, world]);
  return world;
}

export function updateWorld(worldId: string, patch: Partial<World>) {
  const worlds = load<World[]>("wbt:worlds", []);
  save("wbt:worlds", worlds.map((w) => w.id === worldId ? { ...w, ...patch } : w));
  scheduleSnapshot(worldId);
}

export function deleteWorld(worldId: string) {
  save("wbt:worlds", load<World[]>("wbt:worlds", []).filter((w) => w.id !== worldId));
  save(`wbt:eras:${worldId}`, []);
  save(`wbt:events:${worldId}`, []);
  save(`wbt:articles:${worldId}`, []);
  save(`wbt:ideas:${worldId}`, []);
  save(`wbt:help:${worldId}`, []);
  clearSnapshots(worldId);
}

export function addWorld(world: World) {
  const worlds = load<World[]>("wbt:worlds", []);
  save("wbt:worlds", [...worlds, world]);
  scheduleSnapshot(world.id);
}

// ============================================================================
// Eras
// ============================================================================

export function getEras(worldId: string): Era[] {
  return load<Era[]>(`wbt:eras:${worldId}`, []);
}

export function saveEras(worldId: string, eras: Era[]) {
  save(`wbt:eras:${worldId}`, eras);
  scheduleSnapshot(worldId);
}

export function createEra(worldId: string, name: string, shortLabel: string, from: number, to: number): Era {
  const eras = getEras(worldId);
  const era: Era = {
    id: crypto.randomUUID(),
    worldId,
    name,
    shortLabel,
    from,
    to,
    color: ERA_COLORS[eras.length % ERA_COLORS.length],
  };
  saveEras(worldId, [...eras, era]);
  return era;
}

// ============================================================================
// Events
// ============================================================================

export function getEvents(worldId: string): TimelineEvent[] {
  return load<TimelineEvent[]>(`wbt:events:${worldId}`, []);
}

export function saveEvents(worldId: string, events: TimelineEvent[]) {
  save(`wbt:events:${worldId}`, events);
  scheduleSnapshot(worldId);
}

export function createEvent(worldId: string, data: Omit<TimelineEvent, "id" | "worldId">): TimelineEvent {
  const events = getEvents(worldId);
  const ev: TimelineEvent = { id: crypto.randomUUID(), worldId, ...data };
  saveEvents(worldId, [...events, ev]);
  return ev;
}

// ============================================================================
// Articles
// ============================================================================

const ARTICLE_KINDS = ["character", "place", "faction", "creature", "technology", "concept", "other"];
const ARTICLE_COLORS = ["#7a2e2a", "#7fdbff", "#6ad6a3", "#f0b860", "#a06a1d", "#8a91a3", "#5a4be3"];

export function getArticles(worldId: string): Article[] {
  return load<Article[]>(`wbt:articles:${worldId}`, []);
}

export function saveArticles(worldId: string, articles: Article[]) {
  save(`wbt:articles:${worldId}`, articles);
  scheduleSnapshot(worldId);
}

export function createArticle(worldId: string, title: string, kind: string): Article {
  const articles = getArticles(worldId);
  const kindIdx = ARTICLE_KINDS.indexOf(kind);
  const article: Article = {
    id: `ART-${String(articles.length + 1).padStart(3, "0")}`,
    worldId,
    title,
    subtitle: `${kind.charAt(0).toUpperCase() + kind.slice(1)}`,
    tagline: "",
    kind,
    color: ARTICLE_COLORS[kindIdx >= 0 ? kindIdx : articles.length % ARTICLE_COLORS.length],
    facts: [],
    body: [],
    attachments: [],
    links: [],
    updatedAt: new Date().toISOString(),
  };
  saveArticles(worldId, [...articles, article]);
  return article;
}

// ============================================================================
// Ideas
// ============================================================================

const IDEA_GLYPHS = ["star", "planet", "globe", "compass", "moon-stars", "rocket", "book-2", "scroll", "user", "telescope"];
const IDEA_COLORS = ["#7fdbff", "#6ad6a3", "#f0b860", "#e86464", "#7a2e2a", "#a06a1d"];

export function getIdeas(worldId: string): Idea[] {
  return load<Idea[]>(`wbt:ideas:${worldId}`, []);
}

export function saveIdeas(worldId: string, ideas: Idea[]) {
  save(`wbt:ideas:${worldId}`, ideas);
  scheduleSnapshot(worldId);
}

export function createIdea(worldId: string, title: string, note: string, imageUrl?: string): Idea {
  const ideas = getIdeas(worldId);
  const idea: Idea = {
    id: `IDEA-${String(ideas.length + 1).padStart(3, "0")}`,
    worldId,
    title,
    note,
    imageUrl,
    glyph: IDEA_GLYPHS[ideas.length % IDEA_GLYPHS.length],
    color: IDEA_COLORS[ideas.length % IDEA_COLORS.length],
    captured: "just now",
    filed: false,
  };
  saveIdeas(worldId, [idea, ...ideas]);
  return idea;
}

// ============================================================================
// Help articles (user-created)
// ============================================================================

export function getHelpArticles(worldId: string): UserHelpArticle[] {
  return load<UserHelpArticle[]>(`wbt:help:${worldId}`, []);
}

export function saveHelpArticles(worldId: string, articles: UserHelpArticle[]) {
  save(`wbt:help:${worldId}`, articles);
  scheduleSnapshot(worldId);
}

// ============================================================================
// Seed data for a new world
// ============================================================================

export function seedWorld(world: World) {
  // Seed some eras (shortLabel used as year suffix, e.g. "300 BC")
  const e1 = createEra(world.id, "Before the Collapse", "BC", -500, 0);
  const e2 = createEra(world.id, "First Rebuilding", "FR", 0, 300);
  createEra(world.id, "Age of Expansion", "AE", 300, 800);

  // Seed some events (eraYear = year relative to era start)
  createEvent(world.id, { eraYear: 300, title: "The Great Schism", desc: "The governing council fractures into rival factions.", kind: "political", eraId: e1.id, place: "Capital" });
  createEvent(world.id, { eraYear: 0, title: "Year Zero", desc: "A new calendar begins. The old world is declared over.", kind: "historical", eraId: e2.id });
  createEvent(world.id, { eraYear: 150, title: "First Contact", desc: "Signal received from beyond the outer belt.", kind: "discovery", eraId: e2.id });

  // Seed one sample article
  const art = createArticle(world.id, "Sample Character", "character");
  const articles = getArticles(world.id);
  save(`wbt:articles:${world.id}`, articles.map((a) => a.id === art.id ? {
    ...a,
    subtitle: "Character · First Rebuilding",
    tagline: "An example entry. Edit or delete me.",
    facts: [
      { k: "Born", v: "12 AF" },
      { k: "Origin", v: "Northern Provinces" },
    ],
    body: [
      { type: "h2" as const, text: "Background" },
      { type: "p" as const, text: "This is a sample character. Open Edit mode to modify the title, facts, and body sections." },
    ],
  } : a));
}
