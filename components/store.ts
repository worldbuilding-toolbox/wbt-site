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
}

export function deleteWorld(worldId: string) {
  save("wbt:worlds", load<World[]>("wbt:worlds", []).filter((w) => w.id !== worldId));
  save(`wbt:eras:${worldId}`, []);
  save(`wbt:events:${worldId}`, []);
  save(`wbt:articles:${worldId}`, []);
  save(`wbt:ideas:${worldId}`, []);
}

// ============================================================================
// Eras
// ============================================================================

export function getEras(worldId: string): Era[] {
  return load<Era[]>(`wbt:eras:${worldId}`, []);
}

export function saveEras(worldId: string, eras: Era[]) {
  save(`wbt:eras:${worldId}`, eras);
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
  save(`wbt:eras:${worldId}`, [...eras, era]);
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
}

export function createEvent(worldId: string, data: Omit<TimelineEvent, "id" | "worldId">): TimelineEvent {
  const events = getEvents(worldId);
  const ev: TimelineEvent = { id: crypto.randomUUID(), worldId, ...data };
  save(`wbt:events:${worldId}`, [...events, ev]);
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
  save(`wbt:articles:${worldId}`, [...articles, article]);
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
  save(`wbt:ideas:${worldId}`, [idea, ...ideas]);
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
