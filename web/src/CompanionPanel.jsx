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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.645 4.53001L15.4708 3.35501L9.99998 8.82501L4.50915 3.33334L3.33331 4.50834L8.82498 10L3.33331 15.4917L4.50915 16.6667L9.99998 11.175L15.4916 16.6667L16.6666 15.4917L11.1758 10L16.645 4.53001Z" fill="currentColor" />
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
  const [inputEl, setInputEl] = useState(null);
  const [inputPath, setInputPath] = useState("");
  const [inputViewBox, setInputViewBox] = useState("0 0 100 48");
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

  useEffect(() => {
    if (!inputEl) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setInputPath(createScalableSquirclePath(width, height, 48));
        setInputViewBox(`0 0 ${width} ${height}`);
      }
    });
    observer.observe(inputEl);
    return () => observer.disconnect();
  }, [inputEl]);

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
              <motion.svg
                className="companion-panel-close"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={onClose}
                aria-label="Close"
                role="button"
                tabIndex={0}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING, delay: 0.18 }}
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M16.645 4.53001L15.4708 3.35501L9.99998 8.82501L4.50915 3.33334L3.33331 4.50834L8.82498 10L3.33331 15.4917L4.50915 16.6667L9.99998 11.175L15.4916 16.6667L16.6666 15.4917L11.1758 10L16.645 4.53001Z" fill="currentColor" />
              </motion.svg>
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
              <div className="companion-panel-input-wrap" ref={setInputEl}>
                <svg
                  className="companion-panel-input-shape"
                  viewBox={inputViewBox}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d={inputPath} fill="#ffffff" />
                  <path d={inputPath} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                </svg>
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
