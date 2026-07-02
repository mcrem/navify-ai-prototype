import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";
import { createScalableSquirclePath } from "./squircle";

const SUGGESTIONS = [
  "Summarize today's results",
  "Flag anomalies in recent runs",
  "Compare performance to last week",
  "Draft an executive update",
];

const SPRING = { type: "spring", stiffness: 180, damping: 22, mass: 1 };
const PANEL_CORNER_SIZE = 56;

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArcPanel({ isOpen, onClose }) {
  const [panelEl, setPanelEl] = useState(null);
  const [squirclePath, setSquirclePath] = useState("");
  const [viewBox, setViewBox] = useState("0 0 100 100");
  const baseId = useId().replaceAll(":", "");
  const clipId = `${baseId}-clip`;
  const fillId = `${baseId}-fill`;

  useEffect(() => {
    if (!panelEl) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setSquirclePath(createScalableSquirclePath(width, height, PANEL_CORNER_SIZE));
        setViewBox(`0 0 ${width} ${height}`);
      }
    });
    observer.observe(panelEl);
    return () => observer.disconnect();
  }, [panelEl]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="arc-panel"
          ref={setPanelEl}
          initial={{ x: 420, scale: 0.94 }}
          animate={{ x: 0, scale: 1 }}
          exit={{ x: 420, scale: 0.96 }}
          transition={SPRING}
          aria-label="AI Companion"
        >
          <div className="arc-panel-glow" />

          <svg
            className="arc-panel-shape-svg"
            viewBox={viewBox}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={fillId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.86" />
                <stop offset="100%" stopColor="#f8f9ff" stopOpacity="0.76" />
              </linearGradient>
              <clipPath id={clipId}>
                <path d={squirclePath} />
              </clipPath>
            </defs>
            <path d={squirclePath} fill={`url(#${fillId})`} />
            <path d={squirclePath} fill="none" stroke="rgba(255,255,255,0.52)" strokeWidth="1" />
          </svg>

          <div
            className="arc-panel-glass"
            style={{ clipPath: `url(#${clipId})` }}
          >
            <div className="arc-panel-aura arc-panel-aura-one" />
            <div className="arc-panel-aura arc-panel-aura-two" />
            <div className="arc-panel-aura arc-panel-aura-three" />

            <div className="arc-panel-header">
              <motion.span
                className="arc-wordmark"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.1 }}
              >
                AI Companion
              </motion.span>
              <motion.button
                className="arc-close"
                onClick={onClose}
                aria-label="Close"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING, delay: 0.18 }}
              >
                <CloseIcon />
              </motion.button>
            </div>

            <div className="arc-panel-body">
              <motion.div
                className="arc-greeting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.16 }}
              >
                <h2 className="arc-title">How can I help?</h2>
                <p className="arc-subtitle">Ask about workflows, trends, utilization, or what deserves attention next.</p>
              </motion.div>

              <div className="arc-suggestions">
                {SUGGESTIONS.map((text, i) => (
                  <motion.button
                    key={text}
                    className="arc-chip"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...SPRING,
                      delay: 0.24 + i * 0.07,
                    }}
                  >
                    {text}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.div
              className="arc-panel-footer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.46 }}
            >
              <div className="arc-input-wrap">
                <input
                  className="arc-input"
                  type="text"
                  placeholder="Ask AI Companion anything..."
                  aria-label="Ask AI Companion"
                />
                <button className="arc-send" aria-label="Send">
                  <SendIcon />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
