# Worldbuilding Toolbox — improvement plan

## Context

The app is a writing tool: users record worlds, eras/events, articles (with image + file attachments), and an inbox of ideas. **All persistence is browser localStorage** — every world lives in exactly one browser, no backups, no exports, no sync. Attachments are stored as base64 dataUrls inside the JSON, so even a few photos approach the ~5–10 MB origin quota. Auth is a placeholder bit-shift hash with the comment "not for production" (`store.ts:117`). Dashboard literally tells users delete "cannot be undone" (`Dashboard.tsx:85`).

For a writing app this is the single biggest risk surface, and the user's brief makes it explicit: losing user work is unacceptable.

This plan migrates persistence to Supabase (Postgres + Storage + Auth), keeps a fast in-memory cache so the existing component code barely changes, and lands client-side JSON + ZIP exports immediately so users have an escape hatch *before* the migration even ships. Frontend follow-ups (error boundaries, toasts, a11y, tokens) ride along.

## User decisions (already confirmed)

- Balanced audit across data safety / backend / frontend.
- Real auth via Supabase Auth (email/password primary, magic link as a toggle).
- Exports: JSON full dump **and** ZIP bundle (JSON + binary attachments).
- Recently shipped mobile support — not re-touched here.

## To-do list (ordered, data-loss risks first)

### Phase 0 — Persist the plan itself

0. **Commit this plan to the repo as `docs/PLAN.md`** — S. The container this session runs in is ephemeral; the plan file at `/root/.claude/plans/` won't survive. Copy it into the repo on a fresh branch so we can chip away at it across sessions and check items off in PRs. Becomes the durable to-do list.

### Phase 1 — Stop the bleeding (pure client-side, no infra)

1. **Centralise `wbt:help:{worldId}` writes through `store.ts`** — S. `Help.tsx:213,219` read/write localStorage directly, bypassing the typed store. Future migrations will silently miss user-created help guides. Add `getHelpArticles`/`saveHelpArticles` next to the other accessors.
2. **Ship JSON exports — full-account *and* per-world** — S. Walk the relevant `wbt:*` keys, wrap in `{ schemaVersion: 1, scope: "account" | "world", exportedAt, ...payload }`, trigger download. Per-world includes only that world's row + its eras / events / articles / ideas / help. "Export world" lives on the world card's `…` menu in `Dashboard.tsx`; "Export everything" on the Dashboard header. New `components/export.ts`. **Blocks 3, 4, 9.**
3. **Round-trip JSON import — both scopes** — M. Validate `schemaVersion` and `scope`. Per-world import lands as a new world on the current account (regenerate world ID + cascade child IDs to avoid collisions) so a user can hand a world file to a collaborator without nuking theirs. Account-level import keeps the replace-with-confirm strategy. Same code path the Supabase migration wizard will reuse. **Blocks 9.**
4. **ZIP export — full-account *and* per-world** — M. `worldbuilding-toolbox-export.zip` (or `world-{name}.zip`) with `manifest.json` + `attachments/{articleId}/{attachmentId}.{ext}` + `images/{articleId}.{ext}`. Manifest declares `scope` so the importer knows whether to merge as a new world or replace the account. Use `jszip` (~95 KB gzip). New `components/export-zip.ts`.
5. **Snapshot ring + auto-export nudge** — S. On every store write, rotate previous serialised world into `wbt:snapshot:{worldId}:{0|1|2}` (3 deep). When last export ≥ 7 days, show a topbar nudge. Belt for the braces.
6. **Undo for deletes** — S. Stash deleted payload in `wbt:trash:{userId}` with 30-day TTL; "Recently deleted" panel in Dashboard. Covers worlds, events, articles, ideas. Updates the misleading "cannot be undone" message.
7. **Top-level `<ErrorBoundary>` + per-route boundaries** — S. Currently any thrown render error blanks the screen. Add one at `App.tsx` root and one each in Timeline / Article / IdeaInbox / Help. Boundary card offers "Reload" *and* "Export my data" (item 2).
8. **Toast / notification system** — S. Bottom-right (centre on mobile). Used by async save errors, undo deletes (item 6), export success, sync state (item 11). New `components/Toast.tsx` mounted in `App.tsx`. **Blocks 11's sync pill.**

### Phase 2 — Supabase foundations

9. **Schema + RLS + Storage bucket** — M. Tables map 1:1 to `store.ts` types: `profiles`, `worlds`, `eras`, `events`, `articles`, `article_attachments`, `ideas`, `help_articles`. Drop the local users table — `auth.users` owns identity. RLS template per table: `using ( exists ( select 1 from worlds w where w.id = <table>.world_id and w.user_id = auth.uid() ) )`. Attachments + cover images live in a private Storage bucket `worlds-private` with path `{user_id}/{world_id}/articles/{article_id}/{attachment_id}.{ext}` — never inline base64 post-migration. Deliverable: SQL migration + `lib/supabase/types.ts` via `supabase gen types`. **Blocks 10–14.**
10. **Supabase Auth swap** — M. Replace the bit-shift "hash" and the `wbt:users` table. Keep the existing `Auth.tsx` UI; only swap `signIn`/`signUp`/`signOut` implementations. Email/password primary, magic link toggle. Use `@supabase/ssr` for App Router cookies; add `app/auth/callback/route.ts` for magic-link redirect. New `lib/supabase/{client,server}.ts`. **Blocks 11, 12.**
11. **First-login local-data import wizard** — M. On first successful auth, detect any `wbt:*` keys → modal "We found a world in this browser — import it?" Run the JSON-import code path from item 3, decode any inline `dataUrl`s → Blob → upload to Storage. Leave `wbt:imported:{userId}` marker and a manual "delete local copy" button — never auto-delete. New `components/MigrationWizard.tsx`.
12. **Sync model: online-only with optimistic UI** — L. Offline-first / CRDT is over-engineering for long-form prose. Replace `store.ts` internals with an in-memory cache (TanStack Query or hand-rolled); preserve its exported signatures so component call sites barely change. Writes mutate cache immediately, then `await supabase.from(...).update()` in the background with rollback + toast on error. Add a sync-state pill in `Shell.tsx`: Saved / Saving… / Offline — changes will retry. Defer offline-first to v2.
13. **Move attachments + cover images to Storage** — M. Upload via `supabase.storage.from('worlds-private').upload(path, file)`, store path on the row. Display via `createSignedUrl` (1-hour cache). Updates `Article.tsx:192-256` and `IdeaInbox.tsx:55-57`. New `lib/storage.ts`. Stops localStorage quota explosions for new uploads.
14. **Server-side daily backups (belt-and-braces)** — S. Three independent restore paths: (a) enable Supabase PITR on Pro plan (DB); (b) scheduled Edge Function nightly that dumps public schema + lists Storage objects per user to a separate `backups` bucket with 30-day retention; (c) the client-side exports from items 2 / 4, nudged every 7 days (item 5). Document the restore runbook in `README.md`.

### Phase 3 — Backend hardening

15. **Route Handlers for sensitive ops only** — M. RLS handles normal CRUD direct from the client; that's fine. Three things go server-side via `app/api/`: `/api/export` (server-streamed ZIP — avoids client memory limits on big worlds), `/api/import` (validate + transactional insert via service role; the wizard from item 11 calls this), `/api/delete-account` (GDPR-style hard delete across tables + Storage paths). Don't move basic article CRUD here — pure latency cost.
16. **Rate-limit auth + import + export endpoints** — S. Verify Supabase's built-in auth rate limits are on; add Vercel KV / Upstash `Ratelimit` for the Route Handlers: 5 sign-in/min/IP, 3 imports/hour/user, 10 exports/hour/user.
17. **Image transforms / thumbnails** — S. Use Supabase Storage's `?width=400&resize=cover` for grid thumbnails; full res only on the article detail page. Big perceived-perf win on phone camera uploads.

### Phase 4 — Frontend polish

18. **Loading + empty states** — S. Post-Supabase, reads become async; add a `Skeleton` primitive matching the Constellation aesthetic for Dashboard grid + Article list. Empty states already exist in spirit; review for consistency.
19. **Modal / drawer accessibility pass** — M. `Primitives.tsx:415` Modal lacks `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, Escape-to-close, and return-focus-to-trigger. Mobile drawer/sheet (just shipped) has the same gaps. Recommend adopting Radix Dialog + DropdownMenu (zero-style, consumes the existing CSS vars cleanly).
20. **Keyboard shortcuts** — S. `Cmd/Ctrl+K` global search, `Cmd/Ctrl+N` new article/idea, `Cmd/Ctrl+S` force-save with toast, `?` cheatsheet modal, `Esc` closes any overlay (requires item 19). Single window listener + registry in a new `components/shortcuts.ts`.
21. **Tokenise inline styles → CSS Modules** — L. 360 inline-`style={{}}` blocks across 5 components (Timeline 97, Article 111, IdeaInbox 67, Help 56, Dashboard 29). Two real costs: (a) hover/focus state lives in JS booleans and loses keyboard-focus styles; (b) `useIsMobile` causes hydration mismatches because it flips false→true on mount. Migrate one component at a time, starting with `Primitives.tsx`. Reconcile `design/extracted/design_handoff_worldbuilding_toolbox/colors_and_type.css` with `app/globals.css` — pick one as the source of truth for tokens and delete the duplicate.
22. **Autosave UI + dirty-state indicator** — S. Builds on the sync pill from item 12 — adds a tooltip explaining where the data lives. Per-article "Saved 2s ago" indicator in the article toolbar.
23. **`README.md` data-architecture doc** — S. After all of the above the system has localStorage cache + Supabase Postgres + Storage + client exports + server snapshots. Diagram each restore path and document the import/export schema-version contract.

## Critical files

- `components/store.ts` — every persistence path; getting rewritten internally in items 9–13 while keeping its exported signatures stable.
- `components/Auth.tsx` — UI stays, `signIn`/`signUp`/`signOut` swap in item 10.
- `components/Help.tsx` — fix item 1 first so the rest of the plan can rely on store.ts being the only persistence layer.
- `components/Article.tsx`, `components/IdeaInbox.tsx` — attachment + image flow rewrites in item 13.
- `components/Primitives.tsx` — Modal a11y in item 19, CSS Modules pilot in item 21.
- `components/App.tsx` — mount points for ErrorBoundary (item 7), ToastProvider (item 8), MigrationWizard (item 11), shortcut registry (item 20).
- `app/globals.css` + `design/extracted/.../colors_and_type.css` — token source-of-truth reconciliation (item 21).
- New: `components/export.ts`, `components/export-zip.ts`, `components/MigrationWizard.tsx`, `components/Toast.tsx`, `components/ErrorBoundary.tsx`, `components/shortcuts.ts`, `lib/supabase/{client,server,types}.ts`, `lib/storage.ts`, `app/auth/callback/route.ts`, `app/api/{export,import,delete-account}/route.ts`.

## Suggested execution slices

- **Slice 0 (first step)** — item 0. Commit the plan to the repo so future sessions pick up from a stable starting point.
- **Slice A (week 1, no infra)** — items 1–8. Ships per-world + full-account JSON / ZIP exports, snapshot ring, undo, error boundaries, toasts. Users are dramatically safer even if Supabase slips.
- **Slice B (weeks 2–3)** — items 9–11. Schema, Auth swap, migration wizard. Gate behind a feature flag.
- **Slice C (weeks 3–4)** — items 12–13. Sync model + Storage migration. Bulk of the rewrite.
- **Slice D (week 4–5)** — items 14–17. Backups + Route Handlers + rate-limiting + image transforms.
- **Slice E (any time after A)** — items 18–23. Frontend polish, parallelisable.

## Verification

End-to-end checks gated to each slice:

- **After slice A**: create two worlds locally, export the *first* world as JSON, wipe localStorage, import that JSON — only the first world reappears with all eras / events / articles / ideas / attachments intact. Then export *everything* as a ZIP, wipe again, import — both worlds reappear. Repeat per-world ZIP round-trip. Hand a per-world export to a second account (or second browser profile) and confirm it imports as a new world without colliding with existing ones. Confirm snapshot ring fills after three writes. Delete a world, restore from "Recently deleted". Trigger a render error in dev (`throw` inside Timeline) — confirm the boundary card renders with both reload + export buttons.
- **After slice B**: sign up a new user via Supabase, sign in from a fresh browser, verify zero local data leaks. From a browser with pre-existing local data, sign in and run the wizard — confirm every entity ends up in Postgres + Storage with correct RLS (try `select` from a second user — should see nothing).
- **After slice C**: edit an article offline (disable network in DevTools) — confirm UI updates optimistically, sync pill shows "Offline — retrying", reconnect, confirm the row updates in Supabase. Upload a 5 MB image — confirm it lands in Storage, the row stores the path, and the article renders via signed URL.
- **After slice D**: trigger a server-side export of a 50-article world — confirm streamed ZIP arrives intact. Hit the nightly Edge Function manually — confirm a snapshot lands in the `backups` bucket. Walk the restore runbook on a throwaway project.
- **After slice E**: tab through the modal/drawer with a keyboard — focus trapped, Escape closes, focus returns to the trigger. Run a Lighthouse / axe pass on dashboard + article + timeline — confirm a11y score ≥ 95.
