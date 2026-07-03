import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";
import { createScalableSquirclePath } from "./squircle";

const SUGGESTIONS = [
  "What is navify Analytics?",
  "Why is my reagent consumption so high?",
  "What does TAT achievement rate is about?",
];

const SPRING = { type: "spring", stiffness: 180, damping: 22, mass: 1 };
const CORNER_SIZE = 160;

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

export function CompanionPanel({ isOpen, onClose }) {
  const [panelEl, setPanelEl] = useState(null);
  const [squirclePath, setSquirclePath] = useState("");
  const [viewBox, setViewBox] = useState("0 0 100 100");
  const baseId = useId().replaceAll(":", "");
  const glowGradientId = `${baseId}-glow`;

  useEffect(() => {
    if (!panelEl) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setSquirclePath(createScalableSquirclePath(width, height, CORNER_SIZE));
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
          className="companion-panel"
          ref={setPanelEl}
          initial={{ x: 420, scale: 0.94 }}
          animate={{ x: 0, scale: 1 }}
          exit={{ x: 420, scale: 0.96 }}
          transition={SPRING}
          aria-label="AI Companion"
        >
          <svg
            className="companion-panel-glow"
            viewBox={viewBox}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={glowGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="1" />
                <stop offset="50%" stopColor="#1582F8" stopOpacity="1" />
                <stop offset="100%" stopColor="#79E22D" stopOpacity="1" />
                <animate attributeName="x1" values="0%;100%;100%;0%;0%" dur="8s" repeatCount="indefinite" />
                <animate attributeName="y1" values="0%;0%;100%;100%;0%" dur="8s" repeatCount="indefinite" />
                <animate attributeName="x2" values="100%;0%;0%;100%;100%" dur="8s" repeatCount="indefinite" />
                <animate attributeName="y2" values="100%;100%;0%;0%;100%" dur="8s" repeatCount="indefinite" />
              </linearGradient>
            </defs>
            <path d={squirclePath} fill={`url(#${glowGradientId})`} />
          </svg>

          <svg
            className="companion-panel-shape"
            viewBox={viewBox}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={squirclePath} fill="rgba(255,255,255,0.95)" />
            <path d={squirclePath} fill="none" stroke="rgba(255,255,255,0.52)" strokeWidth="1" />
          </svg>

          <div className="companion-panel-content">
            <div className="companion-panel-header">
              <motion.span
                className="companion-panel-title"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.1 }}
              >
                AI Companion
              </motion.span>
              <motion.button
                className="companion-panel-close"
                onClick={onClose}
                aria-label="Close"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING, delay: 0.18 }}
              >
                <CloseIcon />
              </motion.button>
            </div>

            <div className="companion-panel-body">
              <motion.h2
                className="companion-panel-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.16 }}
              >
                How can I help?
              </motion.h2>
            </div>

            <motion.div
              className="companion-panel-footer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.36 }}
            >
              <div className="companion-panel-suggestions">
                {SUGGESTIONS.map((text, i) => (
                  <motion.button
                    key={text}
                    className="companion-panel-suggestion"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING, delay: 0.4 + i * 0.07 }}
                  >
                    {text}
                  </motion.button>
                ))}
              </div>
              <div className="companion-panel-input-wrap">
                <input
                  className="companion-panel-input"
                  type="text"
                  placeholder="Ask navify AI Companion"
                  aria-label="Ask AI Companion"
                />
                <button className="companion-panel-send" aria-label="Send">
                  <SendIcon />
                </button>
              </div>
              <p className="companion-panel-disclaimer">
                AI is not always infallible. <a href="#">Learn more</a>
              </p>
            </motion.div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
