import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useId, useState } from "react";
import { NavifyLogo, AppLauncherIcon, NotificationIcon, RocheLogo, AiCompanionIcon } from "./icons";
import { Sidebar, NAV_ITEMS } from "./Sidebar";
import { ContentSkeleton, generateLayout } from "./ContentSkeleton";
import { ArcPanel } from "./ArcPanel";
import { createScalableSquirclePath } from "./squircle";

const ASSISTANT_COLLAPSED_WIDTH = 40;
const ASSISTANT_EXPANDED_WIDTH = 148;
const ASSISTANT_HEIGHT = 40;

function AiCompanionButton({ isOpen, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const gradientId = useId().replaceAll(":", "");
  const glowGradientId = `${gradientId}-glow`;
  const activeGradientId = `${gradientId}-active`;
  const activeGlowGradientId = `${gradientId}-active-glow`;
  const expanded = hovered || isOpen;
  const width = useMotionValue(expanded ? ASSISTANT_EXPANDED_WIDTH : ASSISTANT_COLLAPSED_WIDTH);
  const shapePath = useTransform(width, (value) => createScalableSquirclePath(value, ASSISTANT_HEIGHT));
  const viewBox = useTransform(width, (value) => `0 0 ${value} ${ASSISTANT_HEIGHT}`);

  useEffect(() => {
    const controls = animate(width, expanded ? ASSISTANT_EXPANDED_WIDTH : ASSISTANT_COLLAPSED_WIDTH, {
      duration: 0.46,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [expanded, width]);

  return (
    <motion.button
      className={`assistant-pill${expanded ? " is-expanded" : ""}${isOpen ? " is-open" : ""}`}
      aria-label="AI Companion"
      aria-expanded={isOpen}
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{ width }}
    >
      <motion.svg
        className="assistant-pill-glow-svg"
        viewBox={viewBox}
        preserveAspectRatio="none"
        style={{ width }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={glowGradientId} x1="12%" y1="10%" x2="88%" y2="90%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.54" />
            <stop offset="50%" stopColor="#1582F8" stopOpacity="0.44" />
            <stop offset="100%" stopColor="#79E22D" stopOpacity="0.34" />
          </linearGradient>
          <linearGradient id={activeGlowGradientId} x1="12%" y1="10%" x2="88%" y2="90%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.54" />
            <stop offset="50%" stopColor="#1582F8" stopOpacity="0.44" />
            <stop offset="100%" stopColor="#79E22D" stopOpacity="0.34" />
          </linearGradient>
        </defs>
        <motion.path className="assistant-pill-glow-static" d={shapePath} fill={`url(#${glowGradientId})`} />
        <motion.path className="assistant-pill-glow-active" d={shapePath} fill={`url(#${activeGlowGradientId})`} />
      </motion.svg>

      <motion.svg
        className="assistant-pill-shape-svg"
        viewBox={viewBox}
        preserveAspectRatio="none"
        style={{ width }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="10%" y1="8%" x2="90%" y2="92%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#238EF2" />
            <stop offset="100%" stopColor="#79E22D" />
          </linearGradient>
          <linearGradient id={activeGradientId} x1="10%" y1="8%" x2="90%" y2="92%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#238EF2" />
            <stop offset="100%" stopColor="#79E22D" />
          </linearGradient>
        </defs>
        <motion.path d={shapePath} fill={`url(#${gradientId})`} />
        <motion.path className="assistant-pill-surface-active" d={shapePath} fill={`url(#${activeGradientId})`} />
      </motion.svg>

      <span className="assistant-pill-label">AI Companion</span>
      <span className="assistant-pill-icon-anchor" aria-hidden="true">
        <AiCompanionIcon className="assistant-pill-icon" />
      </span>
    </motion.button>
  );
}

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
            <AiCompanionButton isOpen={arcOpen} onToggle={() => setArcOpen((prev) => !prev)} />

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
