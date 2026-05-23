"use client";
import React from "react";
import { Button, IconButton, Icon, Tag, Modal, Input, Field, Textarea } from "./Primitives";
import { useIsMobile } from "./hooks";

// ============================================================================
// Built-in help articles
// ============================================================================

type HelpArticle = {
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

type HelpBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "video"; title: string; url?: string; source: string }
  | { type: "image"; caption: string };

const BUILT_IN: Record<string, HelpArticle> = {
  "h-start": {
    id: "h-start", title: "Start your first world", category: "Getting started", icon: "compass", minutes: 4, editable: true,
    lede: "A world starts with a name. Everything else follows.",
    body: [
      { type: "h2", text: "Step 1: Name it" },
      { type: "p", text: "Go to your dashboard and click 'New world'. Give it a name — even a working title. You can change it later." },
      { type: "h2", text: "Step 2: Set your eras" },
      { type: "p", text: "Go to Timeline → Add Era. An era is just a named time period. Call it 'Before the Collapse', 'BCE', 'First Age' — whatever fits your world's calendar." },
      { type: "h2", text: "Step 3: Capture ideas as they come" },
      { type: "p", text: "Use the Ideas tab to drop sparks — a quick title and a note. You don't need to file them yet. That's the whole point of the inbox." },
      { type: "h2", text: "Step 4: Build your first article" },
      { type: "p", text: "Go to Articles → New article. This is where you put the detail: a character, a place, a faction. Start with the info box, add body sections as needed." },
    ],
    next: ["How to design a planet", "Eras, ages, cycles — name your time", "Capture an idea before it evaporates"],
  },
  "h-eras": {
    id: "h-eras", title: "Eras, ages, cycles — name your time", category: "Getting started", icon: "timeline", minutes: 5, editable: true,
    lede: "The Toolbox lets you call a time period anything you like. Era is just the default.",
    body: [
      { type: "h2", text: "Changing the era term" },
      { type: "p", text: "In your timeline, click the Settings icon. You can change 'Era' to Age, Cycle, Reign, Saga — or type your own. This change cascades through the whole timeline." },
      { type: "h2", text: "BCE / AD style labels" },
      { type: "p", text: "Open Timeline Settings. Set 'Negative years label' to 'BCE' and 'Positive years label' to 'AD' (or BF/AF, or whatever your world uses). Negative year numbers show the first label." },
      { type: "h2", text: "Creating eras" },
      { type: "p", text: "Click 'Add Era'. Give it a name and a year range. Negative years work fine — year -500 to 0 is perfectly valid. Each era gets a colour automatically." },
      { type: "h2", text: "Editing eras" },
      { type: "p", text: "Click any era band on the timeline to open its edit panel. You can rename it, shift its years, change its colour, or delete it." },
    ],
    next: ["How to design a planet", "Custom calendars without losing your mind"],
  },
  "h-planet": {
    id: "h-planet", title: "How to design a planet", category: "Designing worlds", icon: "planet", minutes: 8, editable: true,
    lede: "A starting template for building a world's central body. Modify the sections to fit how your world works.",
    body: [
      { type: "h2", text: "Start with one anchor" },
      { type: "p", text: "Pick one thing about the planet that everything else hangs on. A binary sun. A tidal lock. A ring system. A near-extinction event. The anchor decides what's possible for everything else." },
      { type: "h2", text: "The seven default sections" },
      { type: "list", items: [
        "Astronomical context — star, orbit, satellites, year, day",
        "Geography — continents, oceans, climate bands",
        "Life — kingdoms, dominant kinds, what's missing",
        "Civilisations — number, age, where they meet",
        "History — three eras at most for the rough cut",
        "Conflicts — what people are willing to die over",
        "Strangeness — the one thing that's not like Earth",
      ]},
      { type: "video", title: "What 'tidal lock' actually means for storytelling", source: "PBS Space Time · 12:14" },
      { type: "h2", text: "What to leave blank" },
      { type: "p", text: "Plenty. A planet is not an encyclopaedia. Build only what you need for the next chapter. The Toolbox will keep your blank sections forever — they're never broken, they're just not filled in yet." },
      { type: "image", caption: "Default planet template, with three sections collapsed and one expanded" },
      { type: "h2", text: "When you outgrow the template" },
      { type: "p", text: "You will. The template is a starting hand, not a contract. In an article's Edit mode, use the 'Add section' rail at the bottom to add subtitles, paragraphs, dates, conversion rates, and more." },
    ],
    next: ["How to design a creature", "How to design a faction", "Custom calendars without losing your mind"],
  },
  "h-creature": {
    id: "h-creature", title: "How to design a creature", category: "Designing worlds", icon: "moon-stars", minutes: 6, editable: true,
    lede: "Creatures are ecology problems first, story elements second. Start with the world, not the monster.",
    body: [
      { type: "h2", text: "Start from the ecosystem" },
      { type: "p", text: "Where does it live? What does it eat? What eats it? A creature that doesn't fit into an ecosystem will feel like a special effect. One that fits will feel inevitable." },
      { type: "h2", text: "Suggested sections for a creature article" },
      { type: "list", items: [
        "Classification — kingdom, order, colloquial names",
        "Anatomy — size, structure, senses, locomotion",
        "Habitat — biome, range, population density",
        "Behaviour — social structure, feeding, breeding",
        "Relationship to civilisation — hunted, farmed, worshipped, feared",
        "Strangeness — one thing that breaks the expected rules",
      ]},
      { type: "h2", text: "The one-thing rule" },
      { type: "p", text: "Give every creature exactly one thing that is genuinely strange. Not five. One. The rest can be familiar — that's what makes the strange part land." },
      { type: "video", title: "Designing believable alien biology — Brandon Sanderson on xeno-ecology", source: "BYU Writing Course · 18:42" },
      { type: "h2", text: "Create it as an Article" },
      { type: "p", text: "Use Articles → New article, type 'creature'. Add a cover image, fill in the info box with key facts, then build out the body with the sections above. Link it to relevant Places and Factions." },
    ],
    next: ["How to design a planet", "How to design a faction"],
  },
  "h-faction": {
    id: "h-faction", title: "How to design a faction", category: "Designing worlds", icon: "target", minutes: 7, editable: true,
    lede: "A faction is a group with a goal that conflicts with at least one other group. Start with the conflict.",
    body: [
      { type: "h2", text: "The conflict-first method" },
      { type: "p", text: "Before you name the faction, name the thing they want that someone else won't let them have. Everything else — the hierarchy, the rituals, the flag — exists to serve that want." },
      { type: "h2", text: "Suggested sections" },
      { type: "list", items: [
        "Origin — why they formed, and when",
        "Goal — what they're trying to get or protect",
        "Structure — hierarchy, membership, how you join",
        "Resources — what gives them power (land, money, knowledge, violence)",
        "Relationships — allies, enemies, uneasy neutrals",
        "Vulnerabilities — what could end them",
        "Culture — symbols, language, rituals, taboos",
      ]},
      { type: "h2", text: "The three-faction rule" },
      { type: "p", text: "Three factions in conflict is the minimum for interesting politics. Two is a war. Three is a story. Each one should want something the other two could plausibly give or deny." },
      { type: "h2", text: "Link liberally" },
      { type: "p", text: "Use the 'Linked' section to connect your faction to the characters who lead it, the places it controls, and the events it caused. That's how your world gets coherent." },
    ],
    next: ["How to design a planet", "How to design a creature"],
  },
  "h-calendar": {
    id: "h-calendar", title: "Custom calendars without losing your mind", category: "Calendars & time", icon: "calendar", minutes: 9, editable: true,
    lede: "You don't need a fully worked-out calendar to start writing. Here's what you actually need, and when.",
    body: [
      { type: "h2", text: "What you actually need on day one" },
      { type: "p", text: "An epoch (year zero), a rough sense of how long eras last, and a label for years ('SY', 'AF', 'Cycle'). That's it. A 13-month calendar can wait." },
      { type: "h2", text: "Setting your epoch" },
      { type: "p", text: "In Timeline Settings, set the year label for negative and positive years. Year 0 is the pivot — before it is one era, after it is another. You can name it anything (The Collapse, Year of the Signal, The Second Coming)." },
      { type: "h2", text: "Conversion rates" },
      { type: "p", text: "If your world has multiple calendar systems that coexist (like Julian vs Gregorian, or two rival empires with different counts), use the 'Conversion' section block in an article. Add a conversion rate entry: 1 Imperial Year = 1.3 Standard Years, etc." },
      { type: "h2", text: "When to get detailed" },
      { type: "list", items: [
        "When a scene depends on a specific date for a reason (a ritual, a deadline, a season)",
        "When two characters disagree about what year it is, and that disagreement matters",
        "When your readers ask 'wait, how long has that been?'",
      ]},
      { type: "h2", text: "What you can leave vague" },
      { type: "p", text: "Month names, week structure, leap years, solar vs lunar counts — all of these can be vague until the story requires them to be specific. Tolkien got away with it. You can too." },
    ],
    next: ["Eras, ages, cycles — name your time", "Attach Word, PowerPoint, Krita"],
  },
  "h-files": {
    id: "h-files", title: "Attach Word, PowerPoint, Krita files", category: "Files & uploads", icon: "paperclip", minutes: 3, editable: false,
    lede: "Any article can have attachments — drafts, sketches, slide decks, reference sheets. Here's how.",
    body: [
      { type: "h2", text: "Adding an attachment" },
      { type: "p", text: "Open an article in Edit mode. Scroll to the Attachments section and click 'Drop a file, or click to browse'. You can attach Word (.docx), PowerPoint (.pptx), Krita (.kra), PDFs, Markdown files, images, and more." },
      { type: "h2", text: "Supported file types" },
      { type: "list", items: [
        ".docx / .doc — Word documents",
        ".pptx / .ppt — PowerPoint presentations",
        ".kra — Krita paintings and sketches",
        ".pdf — PDF documents",
        ".md — Markdown files",
        ".txt — Plain text",
        ".png / .jpg / .webp — Images",
      ]},
      { type: "h2", text: "Renaming the link" },
      { type: "p", text: "Once a file is attached, you see its filename by default. In Edit mode, click on the filename to rename it to anything — 'Cael's 372 SA ledger (transcription)' is cleaner than 'ledger-372-final-v3.docx'. The underlying file doesn't change." },
      { type: "h2", text: "Downloading an attachment" },
      { type: "p", text: "Click the external-link icon on any attachment row to download it. Attachments are stored in your browser's local storage — export your world's data to keep them safe long-term." },
    ],
    next: ["Rename what a link says", "Start your first world"],
  },
  "h-rename-link": {
    id: "h-rename-link", title: "Rename what a link says", category: "Files & uploads", icon: "link", minutes: 2, editable: false,
    lede: "Attachment links can say anything. Here's how to change the display name without changing the file.",
    body: [
      { type: "h2", text: "How it works" },
      { type: "p", text: "Every attachment has two things: the filename (e.g. 'character-sketch-v2.kra') and the display label (what visitors see). In Edit mode, the label is editable inline — click it and type." },
      { type: "h2", text: "Good labels vs. bad labels" },
      { type: "p", text: "Bad: 'ledger-372-final-v3.docx'. Good: 'The 372 SA ledger — Cael's final transcription'. Labels should tell a reader what's inside, not what the file is called on your drive." },
      { type: "h2", text: "Linked articles work the same way" },
      { type: "p", text: "In the 'Linked' section, the display text is always the linked article's title. To change what it says, rename the article itself — that change cascades to all links pointing to it." },
    ],
    next: ["Attach Word, PowerPoint, Krita files", "Start your first world"],
  },
};

const CATEGORIES = [
  { label: "Getting started", icon: "compass", items: ["h-start", "h-eras"] },
  { label: "Designing worlds", icon: "planet", items: ["h-planet", "h-creature", "h-faction"] },
  { label: "Calendars & time", icon: "calendar", items: ["h-calendar"] },
  { label: "Files & uploads", icon: "paperclip", items: ["h-files", "h-rename-link"] },
];

// ============================================================================
// Help component
// ============================================================================

type UserArticle = HelpArticle & { isUserCreated?: boolean };

export function Help({ world }: { world: { id: string } }) {
  const [activeId, setActiveId] = React.useState("h-planet");
  const [userArticles, setUserArticles] = React.useState<UserArticle[]>([]);
  const [showCreate, setShowCreate] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<string | null>(null);
  const [mobileShowList, setMobileShowList] = React.useState(false);
  const isMobile = useIsMobile();

  // Load user-created help articles from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem(`wbt:help:${world.id}`);
    if (stored) setUserArticles(JSON.parse(stored));
  }, [world.id]);

  const saveUserArticles = (arts: UserArticle[]) => {
    setUserArticles(arts);
    localStorage.setItem(`wbt:help:${world.id}`, JSON.stringify(arts));
  };

  const activeArticle: HelpArticle | UserArticle | undefined =
    BUILT_IN[activeId] || userArticles.find((a) => a.id === activeId);

  const handleCopyToWorld = (article: HelpArticle) => {
    const copy: UserArticle = {
      ...article,
      id: `user-${Date.now()}`,
      title: `${article.title} (my version)`,
      isUserCreated: true,
    };
    saveUserArticles([...userArticles, copy]);
    setActiveId(copy.id);
  };

  const topBarHeight = isMobile ? 52 : 56;
  const showList = !isMobile || mobileShowList;
  const showBody = !isMobile || !mobileShowList;
  const selectArticle = (id: string) => {
    setActiveId(id);
    if (isMobile) setMobileShowList(false);
  };

  return (
    <div style={{ display: "flex", height: `calc(100vh - ${topBarHeight}px)` }}>
      {/* Help sidebar */}
      {showList && (
        <HelpSidebar
          categories={CATEGORIES}
          userArticles={userArticles}
          activeId={activeId}
          onSelect={selectArticle}
          onCreateNew={() => setShowCreate(true)}
          isMobile={isMobile}
        />
      )}

      {/* Article body */}
      {showBody && (
      <div style={{ flex: 1, overflow: "auto" }}>
        {activeArticle ? (
          <HelpArticleBody
            article={activeArticle as UserArticle}
            allArticles={{ ...BUILT_IN, ...Object.fromEntries(userArticles.map((a) => [a.id, a])) }}
            onSelect={selectArticle}
            isMobile={isMobile}
            onBackToList={isMobile ? () => setMobileShowList(true) : undefined}
            onCopyToWorld={!('isUserCreated' in activeArticle && activeArticle.isUserCreated) ? () => handleCopyToWorld(activeArticle) : undefined}
            onEdit={('isUserCreated' in activeArticle && activeArticle.isUserCreated) ? () => setEditingUser(activeArticle.id) : undefined}
            onDelete={('isUserCreated' in activeArticle && activeArticle.isUserCreated) ? () => {
              saveUserArticles(userArticles.filter((a) => a.id !== activeArticle.id));
              setActiveId("h-planet");
            } : undefined}
          />
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--fg-secondary)" }}>Select an article from the sidebar.</div>
          </div>
        )}
      </div>
      )}

      {showCreate && (
        <CreateHelpArticleModal
          onClose={() => setShowCreate(false)}
          onCreate={(article) => {
            const full: UserArticle = { ...article, isUserCreated: true };
            saveUserArticles([...userArticles, full]);
            setActiveId(full.id);
            setShowCreate(false);
          }}
        />
      )}

      {editingUser && (
        <EditHelpArticleModal
          article={userArticles.find((a) => a.id === editingUser)!}
          onClose={() => setEditingUser(null)}
          onSave={(patch) => {
            saveUserArticles(userArticles.map((a) => a.id === editingUser ? { ...a, ...patch } : a));
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Help sidebar
// ============================================================================

function HelpSidebar({ categories, userArticles, activeId, onSelect, onCreateNew, isMobile }: {
  categories: typeof CATEGORIES;
  userArticles: UserArticle[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  isMobile?: boolean;
}) {
  return (
    <aside style={{
      width: isMobile ? "100%" : 280,
      flexShrink: 0,
      borderRight: isMobile ? "none" : "1px solid var(--border)",
      background: "var(--bg-sunken)",
      overflow: "auto",
    }}>
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 6 }}>
          Library
        </div>
        <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.01em" }}>Help & how-to</h3>
      </div>

      <div style={{ padding: "10px 8px" }}>
        {categories.map((cat) => (
          <div key={cat.label} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.14em" }}>
              <Icon name={cat.icon} size={12} />
              {cat.label}
            </div>
            {cat.items.map((id) => {
              const article = BUILT_IN[id];
              if (!article) return null;
              return (
                <HelpSidebarItem key={id} title={article.title} active={activeId === id} onClick={() => onSelect(id)} />
              );
            })}
          </div>
        ))}

        {userArticles.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.14em" }}>
              <Icon name="book" size={12} />
              My guides
            </div>
            {userArticles.map((a) => (
              <HelpSidebarItem key={a.id} title={a.title} active={activeId === a.id} onClick={() => onSelect(a.id)} />
            ))}
          </div>
        )}

        <button
          onClick={onCreateNew}
          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px 8px 14px", background: "transparent", border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-muted)", marginTop: 8 }}
        >
          <Icon name="plus" size={13} />
          New guide
        </button>
      </div>
    </aside>
  );
}

function HelpSidebarItem({ title, active, onClick }: { title: string; active: boolean; onClick: () => void }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", width: "100%", padding: "7px 12px 7px 24px",
        background: active ? "var(--bg-hover)" : hover ? "rgba(255,255,255,0.02)" : "transparent",
        border: "none", borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
        color: active ? "var(--fg)" : "var(--fg-secondary)",
        cursor: "pointer", textAlign: "left",
        fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.4,
        transition: "background 120ms, color 120ms",
      }}
    >
      {title}
    </button>
  );
}

// ============================================================================
// Help article body
// ============================================================================

function HelpArticleBody({ article, allArticles, onSelect, onCopyToWorld, onEdit, onDelete, isMobile, onBackToList }: {
  article: UserArticle;
  allArticles: Record<string, HelpArticle>;
  onSelect: (id: string) => void;
  onCopyToWorld?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isMobile?: boolean;
  onBackToList?: () => void;
}) {
  return (
    <article style={{ padding: isMobile ? "20px 16px 64px" : "48px 56px 96px", maxWidth: 760, margin: "0 auto" }}>
      {onBackToList && (
        <button
          onClick={onBackToList}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", padding: 0,
            cursor: "pointer", color: "var(--accent)",
            fontFamily: "var(--font-mono)", fontSize: 11,
            textTransform: "uppercase", letterSpacing: "0.12em",
            marginBottom: 14,
          }}
        >
          <Icon name="chevron-left" size={13} />
          All guides
        </button>
      )}
      {/* Category kicker */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--fg-muted)" }}>
        <Icon name={article.icon} size={12} style={{ color: "var(--accent)" }} />
        {article.category}
        <span style={{ color: "var(--space-600)" }}>·</span>
        <span>{article.minutes} min read</span>
      </div>

      <h1 style={{ fontFamily: "var(--font-sans)", fontSize: isMobile ? 26 : 34, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--fg)", lineHeight: 1.1 }}>
        {article.title}
      </h1>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: isMobile ? 15 : 18, color: "var(--fg-secondary)", marginTop: 14, lineHeight: 1.5, fontWeight: 300 }}>
        {article.lede}
      </p>

      {/* Template / editable banner */}
      {article.editable && (
        <div style={{
          marginTop: 28, padding: "12px 16px",
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          gap: 12,
        }}>
          <Icon name="settings" size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)", fontWeight: 500 }}>
              {article.isUserCreated ? "This is your guide" : "This template is editable"}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>
              {article.isUserCreated ? "Edit it, or delete it when you're done." : "Copy it to your world, then change the sections to fit."}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {onCopyToWorld && <Button variant="secondary" size="sm" icon="copy" onClick={onCopyToWorld}>Copy to world</Button>}
            {onEdit && <Button variant="secondary" size="sm" icon="pencil" onClick={onEdit}>Edit</Button>}
            {onDelete && <Button variant="danger" size="sm" icon="trash" onClick={() => { if (confirm("Delete this guide?")) onDelete(); }} />}
          </div>
        </div>
      )}

      {/* Body blocks */}
      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
        {article.body.map((block, i) => {
          if (block.type === "h2") return (
            <h2 key={i} style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, color: "var(--fg)", marginTop: 16, letterSpacing: "-0.01em" }}>{block.text}</h2>
          );
          if (block.type === "p") return (
            <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.7, color: "var(--fg)" }}>{block.text}</p>
          );
          if (block.type === "list") return (
            <ul key={i} style={{ margin: 0, paddingLeft: 22, fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.7, color: "var(--fg)" }}>
              {block.items.map((item, j) => <li key={j} style={{ marginBottom: 4 }}>{item}</li>)}
            </ul>
          );
          if (block.type === "video") return <VideoEmbed key={i} title={block.title} source={block.source} url={block.url} />;
          if (block.type === "image") return (
            <figure key={i} style={{ margin: "8px 0", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-elevated)" }}>
              <div style={{ aspectRatio: "16/9", background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-muted)" }}>
                <Icon name="photo" size={28} />
              </div>
              <figcaption style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Fig — {block.caption}
              </figcaption>
            </figure>
          );
          return null;
        })}
      </div>

      {/* Try next */}
      {article.next.length > 0 && (
        <div style={{ marginTop: 56, padding: "18px 22px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>
            Try next
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {article.next.map((n) => {
              const found = Object.values(allArticles).find((a) => a.title === n);
              return (
                <button
                  key={n}
                  onClick={() => { if (found) onSelect(found.id); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg)", textAlign: "left" }}
                >
                  <span>{n}</span>
                  <Icon name="arrow-right" size={14} style={{ color: "var(--accent)" }} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}

// ============================================================================
// Video embed
// ============================================================================

function VideoEmbed({ title, source, url }: { title: string; source: string; url?: string }) {
  const [playing, setPlaying] = React.useState(false);

  if (url && playing) {
    const ytId = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)?.[1];
    if (ytId) {
      return (
        <div style={{ margin: "8px 0", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <div style={{ aspectRatio: "16/9" }}>
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
          <div style={{ padding: "10px 14px", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg)" }}>{title}</div>
        </div>
      );
    }
  }

  return (
    <div style={{ margin: "8px 0", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-elevated)" }}>
      <button
        onClick={() => { if (url) setPlaying(true); }}
        style={{
          display: "block", width: "100%", background: "transparent", border: "none", padding: 0, cursor: url ? "pointer" : "default",
        }}
      >
        <div style={{ aspectRatio: "16/9", background: "linear-gradient(180deg, var(--space-850) 0%, var(--space-950) 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", boxShadow: "0 0 24px var(--cyan-glow)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <div style={{ position: "absolute", bottom: 10, left: 14, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{source}</div>
          {!url && <div style={{ position: "absolute", bottom: 10, right: 14, fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Add URL to enable</div>}
        </div>
      </button>
      <div style={{ padding: "10px 14px", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg)" }}>{title}</div>
    </div>
  );
}

// ============================================================================
// Create/edit user help article modals
// ============================================================================

function CreateHelpArticleModal({ onClose, onCreate }: { onClose: () => void; onCreate: (a: HelpArticle) => void }) {
  const [title, setTitle] = React.useState("");
  const [lede, setLede] = React.useState("");
  const [category, setCategory] = React.useState("My guides");

  return (
    <Modal title="New guide" onClose={onClose} width={480}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Field label="Title">
          <Input autoFocus value={title} onChange={setTitle} placeholder="e.g. Notes on the Salt Court's legal system" />
        </Field>
        <Field label="Category">
          <Input value={category} onChange={setCategory} placeholder="e.g. My guides, Research, World notes" />
        </Field>
        <Field label="Opening summary">
          <Textarea value={lede} onChange={setLede} rows={2} placeholder="One or two sentences about what this guide covers." />
        </Field>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="plus" onClick={() => {
            if (title.trim()) onCreate({
              id: `user-${Date.now()}`,
              title: title.trim(), lede, category, icon: "book", minutes: 5,
              editable: true, body: [{ type: "p", text: "Start writing..." }], next: [],
            });
          }}>
            Create guide
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function EditHelpArticleModal({ article, onClose, onSave }: { article: UserArticle; onClose: () => void; onSave: (p: Partial<UserArticle>) => void }) {
  const [title, setTitle] = React.useState(article.title);
  const [lede, setLede] = React.useState(article.lede);
  const [body, setBody] = React.useState(article.body.map((b) => b.type === "p" ? b.text : "").filter(Boolean).join("\n\n"));

  return (
    <Modal title="Edit guide" onClose={onClose} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Field label="Title">
          <Input value={title} onChange={setTitle} />
        </Field>
        <Field label="Opening summary">
          <Textarea value={lede} onChange={setLede} rows={2} />
        </Field>
        <Field label="Body (paragraphs separated by blank lines)">
          <Textarea value={body} onChange={setBody} rows={10} />
        </Field>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="device-floppy" onClick={() => {
            const paras = body.split(/\n\n+/).filter(Boolean);
            onSave({
              title, lede,
              body: paras.map((t) => t.startsWith("## ") ? { type: "h2" as const, text: t.slice(3) } : { type: "p" as const, text: t }),
            });
          }}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
