import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { NavifyLogo, AppLauncherIcon, NotificationIcon, RocheLogo } from "./icons";
import { Sidebar, NAV_ITEMS } from "./Sidebar";
import { ContentSkeleton, generateLayout } from "./ContentSkeleton";
import { ArcPanel } from "./ArcPanel";


function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [arcOpen, setArcOpen] = useState(false);
  const [scene, setScene] = useState({
    key: 1,
    title: "Welcome",
    layout: generateLayout("home"),
  });
  useEffect(() => {
    document.title = "navify® Analytics";
  }, []);

  function handleSectionSelect(sectionId) {
    if (sectionId === activeSection) {
      return;
    }

    const nextItem = NAV_ITEMS.find((item) => item.id === sectionId);
    if (!nextItem) {
      return;
    }

    setActiveSection(sectionId);
    setScene({
      key: Date.now(),
      title: nextItem.title,
      layout: generateLayout(sectionId),
    });
  }

  return (
    <div className="page">
      <header className="topbar" aria-label="navify header">
        <div className="topbar-accent" />

        <div className="topbar-inner">
          <div className="brand-group">
            <NavifyLogo />
            <span className="brand-title">Analytics for Core Lab</span>
          </div>

          <div className="actions-group">
            <button className="icon-button" aria-label="Apps">
              <AppLauncherIcon />
            </button>
            <button className="icon-button" aria-label="Notifications">
              <NotificationIcon />
            </button>
            <button className="icon-button" aria-label="Help">
              <span className="icon-help">?</span>
            </button>
            <button
              className="assistant-pill"
              aria-label="AI Companion"
              aria-expanded={arcOpen}
              onClick={() => setArcOpen((prev) => !prev)}
            >
              <span className="assistant-pill-glow" aria-hidden="true" />
              <span className="assistant-pill-label assistant-pill-label-short">AI</span>
              <span className="assistant-pill-label assistant-pill-label-long">Ready to assist</span>
            </button>

            <span className="vertical-divider" aria-hidden="true" />

            <button className="profile-chip" aria-label="User profile">
              MC
            </button>

            <button className="roche-badge" aria-label="Roche">
              <RocheLogo />
            </button>
          </div>
        </div>
      </header>

      <div className="layout-shell">
        <Sidebar activeSection={activeSection} onSelect={handleSectionSelect} />

        <main className="content-placeholder">
          <div className="content-scroll-region">
            <AnimatePresence mode="wait">
              <ContentSkeleton
                title={scene.title}
                layout={scene.layout}
                sceneKey={scene.key}
              />
            </AnimatePresence>
          </div>
        </main>
      </div>

      <ArcPanel isOpen={arcOpen} onClose={() => setArcOpen(false)} />
    </div>
  );
}

export default App;
