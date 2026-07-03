import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createScalableSquirclePath } from "./squircle";

const SUGGESTIONS = [
  "What is navify Analytics?",
  "Why is my reagent consumption so high?",
  "What does TAT achievement rate is about?",
];

export const AI_RESPONSES = [
  "Based on your recent data, reagent consumption has increased by 12% over the last quarter. This is primarily driven by higher test volumes in the immunoassay department. I'd recommend reviewing your calibration frequency and checking for any recent protocol changes.",
  "navify Analytics is a cloud-based laboratory analytics platform that provides real-time visibility into your lab operations. It helps you monitor KPIs, identify bottlenecks, and optimize workflows across your entire instrument fleet.",
  "Your TAT achievement rate measures the percentage of tests completed within the target turnaround time. Currently, your lab is achieving 87% against a 90% target. The main delays appear to be in the pre-analytical phase.",
  "Looking at your instrument utilization data, I can see that two of your cobas analyzers are running below 60% capacity during night shifts. Redistributing workload could improve overall throughput by up to 15%.",
  "The quality control data shows all assays are within acceptable ranges. However, I noticed a slight upward trend in CV% for your thyroid panel over the past two weeks. It might be worth investigating before it triggers a flag.",
  "Your sample rejection rate this month is 3.2%, which is above the industry benchmark of 2%. The most common reason is insufficient sample volume. Consider reviewing collection protocols with the phlebotomy team.",
  "I can see that your pending order queue has grown by 20% this week. This correlates with the staffing changes on the morning shift. Would you like me to suggest an optimized workflow schedule?",
];

const SPRING = { type: "spring", stiffness: 180, damping: 22, mass: 1 };
const CORNER_SIZE = 160;
export const THINKING_DELAY_MIN = 2000;
export const THINKING_DELAY_MAX = 4000;
export const TYPING_SPEED = 8;

const AI_ICON_PATH_1 =
  "M9.99979 0.00390139C9.99629 1.52052 10.0138 2.91422 10.2292 4.07233C10.4417 5.21433 10.8336 6.04554 11.394 6.60595C11.9544 7.16635 12.7856 7.55826 13.9276 7.77072C15.0857 7.98613 16.4794 8.00367 17.996 8.00017L18 9.99972C16.5105 10.0032 14.9331 9.99104 13.5625 9.73611C12.1758 9.47819 10.9194 8.95882 9.98026 8.01969C9.04113 7.08056 8.52176 5.82412 8.26384 4.43748C8.00891 3.06687 7.9968 1.48942 8.00023 -3.81472e-06L9.99979 0.00390139Z";
const AI_ICON_PATH_2 =
  "M8.00015 17.996C8.00365 16.4793 7.98612 15.0856 7.77071 13.9275C7.55825 12.7855 7.16633 11.9543 6.60593 11.3939C6.04552 10.8335 5.2143 10.4416 4.07232 10.2291C2.9142 10.0137 1.5205 9.99619 0.003889 9.9997L-1.62125e-05 8.00014C1.48941 7.9967 3.06685 8.00882 4.43747 8.26375C5.82411 8.52167 7.08055 9.04105 8.01968 9.98017C8.95881 10.9193 9.47818 12.1757 9.73609 13.5624C9.99103 14.933 10.0031 16.5104 9.99971 17.9999L8.00015 17.996Z";

export function UserBubble({ children }) {
  const [el, setEl] = useState(null);
  const [path, setPath] = useState("");
  const [vb, setVb] = useState("0 0 100 40");

  useEffect(() => {
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
      const h = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      if (w > 0 && h > 0) {
        setPath(createScalableSquirclePath(w, h, 40));
        setVb(`0 0 ${w} ${h}`);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [el]);

  return (
    <div className="companion-bubble" ref={setEl}>
      <svg
        className="companion-bubble-shape"
        viewBox={vb}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={path} fill="rgba(0, 0, 0, 0.04)" />
        <path d={path} fill="none" stroke="rgba(0, 0, 0, 0.08)" strokeWidth="1" />
      </svg>
      <span className="companion-bubble-text">{children}</span>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <path d="M19.8671 10.2L5.86707 3.19997C5.52121 3.03254 5.13444 2.96828 4.75302 3.01489C4.3716 3.0615 4.01168 3.21699 3.71632 3.46278C3.42095 3.70857 3.20264 4.03424 3.0875 4.40084C2.97236 4.76744 2.96527 5.15944 3.06707 5.52997L5.00607 12L3.07607 18.47C2.97427 18.8405 2.98136 19.2325 3.0965 19.5991C3.21164 19.9657 3.42995 20.2914 3.72532 20.5372C4.02068 20.7829 4.3806 20.9384 4.76202 20.985C5.14344 21.0317 5.53021 20.9674 5.87607 20.8L19.8761 13.8C20.2142 13.6362 20.4994 13.3805 20.6989 13.0621C20.8985 12.7438 21.0043 12.3757 21.0043 12C21.0043 11.6243 20.8985 11.2561 20.6989 10.9378C20.4994 10.6194 20.2142 10.3637 19.8761 10.2H19.8671ZM17.0071 11H6.79707L5.00707 4.99997L17.0071 11ZM5.00707 19L6.78707 13H17.0071L5.00707 19Z" fill="currentColor" />
    </svg>
  );
}

export function ThinkingIndicator() {
  const id = useId().replaceAll(":", "");
  const gradId = `${id}-thinking-grad`;

  return (
    <motion.div
      className="companion-thinking"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="companion-thinking-icon"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="50%" stopColor="#1582F8" />
              <stop offset="100%" stopColor="#79E22D" />
            </linearGradient>
          </defs>
          <path d={AI_ICON_PATH_1} fill={`url(#${gradId})`} />
          <path d={AI_ICON_PATH_2} fill={`url(#${gradId})`} />
        </svg>
      </motion.div>
      <span className="companion-thinking-label">Thinking...</span>
    </motion.div>
  );
}

export function TypingMessage({ text, onComplete, scrollRef }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        clearInterval(interval);
        if (onCompleteRef.current) onCompleteRef.current();
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
      if (scrollRef?.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, [text, scrollRef]);

  return <>{displayed}</>;
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

  const [mode, setMode] = useState("welcome");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const thinkingTimer = useRef(null);
  const responseIndex = useRef(0);
  const chatAreaRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      clearTimeout(thinkingTimer.current);
      setMode("welcome");
      setInputValue("");
      setMessages([]);
      setIsThinking(false);
      setIsTyping(false);
      setScrolled(false);
      responseIndex.current = 0;
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isThinking, isTyping]);

  const handleScroll = useCallback(() => {
    if (chatAreaRef.current) {
      setScrolled(chatAreaRef.current.scrollTop > 8);
    }
  }, []);

  const handleTypingComplete = useCallback((msgIndex) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === msgIndex ? { ...m, typed: true } : m))
    );
    setIsTyping(false);
  }, []);

  const handleSend = useCallback(
    (overrideText) => {
      const text = (overrideText || inputValue).trim();
      if (!text || isThinking || isTyping) return;

      const isFirstMessage = mode === "welcome";

      setMessages((prev) => {
        const updated = isFirstMessage
          ? [{ text: "How can I help?", sender: "ai", typed: true }, { text, sender: "user" }]
          : [...prev, { text, sender: "user" }];
        return updated;
      });

      setInputValue("");
      setMode("chat");
      setIsThinking(true);

      const delay = THINKING_DELAY_MIN + Math.random() * (THINKING_DELAY_MAX - THINKING_DELAY_MIN);
      thinkingTimer.current = setTimeout(() => {
        const response = AI_RESPONSES[responseIndex.current % AI_RESPONSES.length];
        responseIndex.current += 1;
        setMessages((prev) => [...prev, { text: response, sender: "ai", typed: false }]);
        setIsThinking(false);
        setIsTyping(true);
      }, delay);
    },
    [inputValue, isThinking, isTyping, mode]
  );

  useEffect(() => {
    return () => clearTimeout(thinkingTimer.current);
  }, []);

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

  const isBusy = isThinking || isTyping;

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

            <AnimatePresence mode="wait">
              {mode === "welcome" ? (
                <motion.div
                  key="welcome"
                  className="companion-panel-body"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.h2
                    className="companion-panel-heading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING, delay: 0.16 }}
                  >
                    How can I help?
                  </motion.h2>
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  className={`companion-chat-area${scrolled ? " is-scrolled" : ""}`}
                  ref={chatAreaRef}
                  onScroll={handleScroll}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      className={`companion-message companion-message--${msg.sender}`}
                      initial={{ opacity: 0, x: msg.sender === "ai" ? -12 : 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...SPRING, delay: i < 2 ? i * 0.1 : 0.05 }}
                    >
                      {msg.sender === "user" ? (
                        <UserBubble>{msg.text}</UserBubble>
                      ) : !msg.typed ? (
                        <TypingMessage
                          text={msg.text}
                          onComplete={() => handleTypingComplete(i)}
                          scrollRef={chatAreaRef}
                        />
                      ) : (
                        msg.text
                      )}
                    </motion.div>
                  ))}
                  <AnimatePresence>
                    {isThinking && <ThinkingIndicator />}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="companion-panel-footer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.36 }}
            >
              <AnimatePresence>
                {mode === "welcome" && (
                  <motion.div
                    key="suggestions"
                    className="companion-panel-suggestions"
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {SUGGESTIONS.map((text, i) => (
                      <motion.button
                        key={text}
                        className="companion-panel-suggestion"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...SPRING, delay: 0.4 + i * 0.07 }}
                        onClick={() => handleSend(text)}
                      >
                        {text}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className={`companion-panel-input-wrap${isBusy ? " is-disabled" : ""}`} ref={setInputEl}>
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
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  disabled={isBusy}
                />
                <button
                  className="companion-panel-send"
                  aria-label="Send"
                  onClick={() => handleSend()}
                  disabled={isBusy}
                >
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
