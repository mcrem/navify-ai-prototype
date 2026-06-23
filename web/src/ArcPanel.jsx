import { AnimatePresence, motion } from "framer-motion";

const SUGGESTIONS = [
  "Summarize today's results",
  "Flag anomalies in recent runs",
  "Compare performance to last week",
  "Draft an executive update",
];

const SPRING = { type: "spring", stiffness: 180, damping: 22, mass: 1 };

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
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="arc-panel"
          initial={{ x: 420, scale: 0.94 }}
          animate={{ x: 0, scale: 1 }}
          exit={{ x: 420, scale: 0.96 }}
          transition={SPRING}
          aria-label="AI Companion"
        >
          <div className="arc-panel-glow" />
          <div className="arc-panel-glass">
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
