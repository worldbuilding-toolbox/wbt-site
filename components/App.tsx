"use client";
import React from "react";
import { AuthScreen } from "./Auth";
import { Sidebar, TopBar } from "./Shell";
import { Dashboard } from "./Dashboard";
import { Timeline } from "./Timeline";
import { ArticleView } from "./Article";
import { IdeaInbox } from "./IdeaInbox";
import { Help } from "./Help";
import { useIsMobile } from "./hooks";
import { getCurrentUser, getWorlds, signOut, type User, type World } from "./store";

type Screen = "dashboard" | "world";
type WorldView = "timeline" | "articles" | "ideas" | "help";

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [worlds, setWorlds] = React.useState<World[]>([]);
  const [screen, setScreen] = React.useState<Screen>("dashboard");
  const [currentWorldId, setCurrentWorldId] = React.useState<string | null>(null);
  const [view, setView] = React.useState<WorldView>("timeline");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    const u = getCurrentUser();
    if (u) {
      setUser(u);
      setWorlds(getWorlds(u.id));
    }
  }, []);

  const reloadWorlds = React.useCallback(() => {
    if (user) setWorlds(getWorlds(user.id));
  }, [user]);

  const handleAuth = (u: User) => {
    setUser(u);
    setWorlds(getWorlds(u.id));
  };

  const handleSignOut = () => {
    signOut();
    setUser(null);
    setWorlds([]);
    setScreen("dashboard");
    setCurrentWorldId(null);
  };

  const handleOpenWorld = (id: string) => {
    setCurrentWorldId(id);
    setScreen("world");
    setView("timeline");
    setSearchQuery("");
  };

  const handleGoToDashboard = () => {
    setScreen("dashboard");
    setCurrentWorldId(null);
    setSearchQuery("");
  };

  const handleChangeView = (v: WorldView) => {
    setView(v);
    setSearchQuery("");
  };

  const currentWorld = worlds.find((w) => w.id === currentWorldId) || null;

  if (!user) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        user={user}
        worlds={worlds}
        world={screen === "world" ? currentWorld : null}
        view={view}
        onGoToDashboard={handleGoToDashboard}
        onSelectWorld={handleOpenWorld}
        onChangeView={handleChangeView}
        onSignOut={handleSignOut}
        isMobile={isMobile}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <TopBar
          world={screen === "world" ? currentWorld : null}
          view={view}
          onGoToDashboard={handleGoToDashboard}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          isMobile={isMobile}
          onOpenMenu={() => setMenuOpen(true)}
        />

        <div style={{ flex: 1, overflow: "auto" }}>
          {screen === "dashboard" && (
            <Dashboard
              user={user}
              worlds={worlds}
              onOpenWorld={handleOpenWorld}
              onWorldsChange={reloadWorlds}
            />
          )}

          {screen === "world" && currentWorld && (
            <>
              {view === "timeline" && (
                <Timeline
                  world={currentWorld}
                  onWorldChange={() => {
                    reloadWorlds();
                  }}
                />
              )}
              {view === "articles" && (
                <ArticleView
                  world={currentWorld}
                  searchQuery={searchQuery}
                />
              )}
              {view === "ideas" && (
                <IdeaInbox
                  world={currentWorld}
                  searchQuery={searchQuery}
                />
              )}
              {view === "help" && (
                <Help world={currentWorld} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
