import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { NavifyLogo, AppLauncherIcon, NotificationIcon, RocheLogo, AiCompanionIcon } from "./icons";
import { Sidebar, NAV_ITEMS } from "./Sidebar";
import { ContentSkeleton, generateLayout } from "./ContentSkeleton";
import { CompanionPanel, AI_RESPONSES, THINKING_DELAY_MIN, THINKING_DELAY_MAX, TYPING_SPEED, ThinkingIndicator, TypingMessage, UserBubble } from "./CompanionPanel";
import { createScalableSquirclePath } from "./squircle";
import { BrandProvider, useBrand, BRANDS } from "./brand";
import iphoneAppImg from "/iphone-app.svg";

function BrandSwitcher() {
  const { brand, setBrand } = useBrand();
  return (
    <>
      <div className="app-launcher-separator" />
      {Object.entries(BRANDS).map(([key, { label }]) => (
        <button
          key={key}
          className={`app-launcher-item${key === brand ? " is-selected" : ""}`}
          onClick={() => setBrand(key)}
        >
          {label}
        </button>
      ))}
    </>
  );
}

const BUTTON_COLLAPSED_WIDTH = 40;
const BUTTON_HEIGHT = 40;
const BUTTON_PADDING = 11 + 8 + 18 + 11; // left + gap + icon + right

const STAGES = [
  { id: 1, label: "Stage 1: AI as a Feature" },
  { id: 2, label: "Stage 2: AI as a Connector" },
  { id: 3, label: "Stage 3: AI as a Platform" },
];

function AiCompanionButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  const [expandedWidth, setExpandedWidth] = useState(BUTTON_COLLAPSED_WIDTH);
  const hoverTimer = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (labelRef.current) {
      setExpandedWidth(Math.ceil(labelRef.current.scrollWidth) + BUTTON_PADDING);
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    hoverTimer.current = setTimeout(() => setHovered(true), 120);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimer.current);
    setHovered(false);
  }, []);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const gradientId = useId().replaceAll(":", "");
  const glowGradientId = `${gradientId}-glow`;
  const activeGradientId = `${gradientId}-active`;
  const activeGlowGradientId = `${gradientId}-active-glow`;
  const width = useMotionValue(hovered ? expandedWidth : BUTTON_COLLAPSED_WIDTH);
  const shapePath = useTransform(width, (value) => createScalableSquirclePath(value, BUTTON_HEIGHT));
  const viewBox = useTransform(width, (value) => `0 0 ${value} ${BUTTON_HEIGHT}`);

  useEffect(() => {
    const controls = animate(width, hovered ? expandedWidth : BUTTON_COLLAPSED_WIDTH, {
      duration: 0.46,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [hovered, width, expandedWidth]);

  return (
    <motion.button
      className={`ai-button${hovered ? " is-expanded" : ""}`}
      aria-label="navify AI Companion"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      style={{ width }}
    >
      <motion.svg
        className="ai-button-glow-svg"
        viewBox={viewBox}
        preserveAspectRatio="none"
        style={{ width }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={glowGradientId} x1="12%" y1="10%" x2="88%" y2="90%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="1" />
            <stop offset="50%" stopColor="#1582F8" stopOpacity="1" />
            <stop offset="100%" stopColor="#79E22D" stopOpacity="1" />
          </linearGradient>
          <linearGradient id={activeGlowGradientId} x1="12%" y1="10%" x2="88%" y2="90%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="1" />
            <stop offset="50%" stopColor="#1582F8" stopOpacity="1" />
            <stop offset="100%" stopColor="#79E22D" stopOpacity="1" />
          </linearGradient>
        </defs>
        <motion.path className="ai-button-glow-static" d={shapePath} fill={`url(#${glowGradientId})`} />
        <motion.path className="ai-button-glow-active" d={shapePath} fill={`url(#${activeGlowGradientId})`} />
      </motion.svg>

      <motion.svg
        className="ai-button-shape-svg"
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
        <motion.path className="ai-button-surface-active" d={shapePath} fill={`url(#${activeGradientId})`} />
      </motion.svg>

      <span className="ai-button-content" aria-hidden="true">
        <span className="ai-button-label-clip">
          <span className="ai-button-label" ref={labelRef}>AI Companion</span>
        </span>
        <span className="ai-button-icon-anchor">
          <AiCompanionIcon className="ai-button-icon" />
        </span>
      </span>
    </motion.button>
  );
}

function AiCompanionLogo() {
  const gradientId = useId().replaceAll(":", "");
  const path = createScalableSquirclePath(BUTTON_COLLAPSED_WIDTH, BUTTON_HEIGHT);

  return (
    <span className="ai-logo" aria-hidden="true">
      <svg
        className="ai-logo-shape"
        viewBox={`0 0 ${BUTTON_COLLAPSED_WIDTH} ${BUTTON_HEIGHT}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="10%" y1="8%" x2="90%" y2="92%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#238EF2" />
            <stop offset="100%" stopColor="#79E22D" />
          </linearGradient>
        </defs>
        <path d={path} fill={`url(#${gradientId})`} />
      </svg>
      <span className="ai-logo-icon">
        <AiCompanionIcon className="ai-button-icon" />
      </span>
    </span>
  );
}

const SPRING = { type: "spring", stiffness: 180, damping: 22, mass: 1 };

const MOBILE_SUGGESTIONS = [
  "Explain my glucose trend",
  "Why is my reading high?",
  "What should I do before bed?",
];

function MobileAiButton({ onClick }) {
  const gradientId = useId().replaceAll(":", "");
  const path = createScalableSquirclePath(64, 64);

  return (
    <button className="mobile-ai-button" onClick={onClick} aria-label="navify AI Companion">
      <svg className="mobile-ai-button-glow" viewBox="0 0 64 64" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${gradientId}-mg`} x1="10%" y1="8%" x2="90%" y2="92%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="1" />
            <stop offset="50%" stopColor="#1582F8" stopOpacity="1" />
            <stop offset="100%" stopColor="#79E22D" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path d={path} fill={`url(#${gradientId}-mg)`} />
      </svg>
      <svg className="mobile-ai-button-shape" viewBox="0 0 64 64" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="10%" y1="8%" x2="90%" y2="92%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#238EF2" />
            <stop offset="100%" stopColor="#79E22D" />
          </linearGradient>
        </defs>
        <path d={path} fill={`url(#${gradientId})`} />
      </svg>
      <span className="mobile-ai-button-icon">
        <AiCompanionIcon className="mobile-ai-icon" />
      </span>
    </button>
  );
}

const MOBILE_CORNER_SIZE = 44;

function MobilePanel({ isOpen, onClose }) {
  const [panelEl, setPanelEl] = useState(null);
  const [squirclePath, setSquirclePath] = useState("");
  const [panelViewBox, setPanelViewBox] = useState("0 0 100 100");
  const [inputEl, setInputEl] = useState(null);
  const [inputPath, setInputPath] = useState("");
  const [inputViewBox, setInputViewBox] = useState("0 0 100 40");
  const baseId = useId().replaceAll(":", "");
  const glowGradientId = `${baseId}-mobile-glow`;

  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState("welcome");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const thinkingTimer = useRef(null);
  const responseIndex = useRef(0);
  const chatAreaRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleDragEnd = useCallback((event, info) => {
    if (info.offset.y < -30 || info.velocity.y < -300) {
      setExpanded(true);
    } else if (info.offset.y > 30 || info.velocity.y > 300) {
      if (expanded) {
        setExpanded(false);
      } else {
        onClose();
      }
    }
  }, [expanded, onClose]);

  useEffect(() => {
    if (!isOpen) {
      clearTimeout(thinkingTimer.current);
      setMode("welcome");
      setInputValue("");
      setMessages([]);
      setIsThinking(false);
      setIsTyping(false);
      setScrolled(false);
      setExpanded(false);
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
        return isFirstMessage
          ? [{ text: "How can I help?", sender: "ai", typed: true }, { text, sender: "user" }]
          : [...prev, { text, sender: "user" }];
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
        setSquirclePath(createScalableSquirclePath(width, height, MOBILE_CORNER_SIZE));
        setPanelViewBox(`0 0 ${width} ${height}`);
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
        setInputPath(createScalableSquirclePath(width, height, 40));
        setInputViewBox(`0 0 ${width} ${height}`);
      }
    });
    observer.observe(inputEl);
    return () => observer.disconnect();
  }, [inputEl]);

  const isBusy = isThinking || isTyping;

  if (!isOpen) return null;

  return (
    <motion.div
      className="mobile-panel"
      ref={setPanelEl}
      initial={{ y: "100%", opacity: 0.8 }}
      animate={{ y: 0, opacity: 1, top: expanded ? "9%" : "38%" }}
      exit={{ y: "100%", opacity: 0.8 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      <svg
        className="mobile-panel-glow"
        viewBox={panelViewBox}
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
        className="mobile-panel-shape"
        viewBox={panelViewBox}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={squirclePath} fill="rgba(255,255,255,0.95)" />
        <path d={squirclePath} fill="none" stroke="rgba(255,255,255,0.52)" strokeWidth="1" />
      </svg>

      <div className="mobile-panel-content">
        <motion.div
          className="mobile-panel-drag-region"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.05}
          onDragEnd={handleDragEnd}
        >
          <div className="mobile-panel-handle" />
          <div className="mobile-panel-header">
            <span className="mobile-panel-title">navify AI Companion</span>
            <svg
              className="mobile-panel-close"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={onClose}
              role="button"
              tabIndex={0}
              style={{ display: "block", cursor: "pointer" }}
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M16.645 4.53001L15.4708 3.35501L9.99998 8.82501L4.50915 3.33334L3.33331 4.50834L8.82498 10L3.33331 15.4917L4.50915 16.6667L9.99998 11.175L15.4916 16.6667L16.6666 15.4917L11.1758 10L16.645 4.53001Z" fill="#544f4f" />
            </svg>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {mode === "welcome" ? (
            <motion.div key="welcome" className="mobile-panel-body" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <h2 className="mobile-panel-heading">How can I help?</h2>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              className={`mobile-panel-chat${scrolled ? " is-scrolled" : ""}`}
              ref={chatAreaRef}
              onScroll={handleScroll}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
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
                    <TypingMessage text={msg.text} onComplete={() => handleTypingComplete(i)} scrollRef={chatAreaRef} />
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

        <div className="mobile-panel-footer">
          <AnimatePresence>
            {mode === "welcome" && (
              <motion.div key="suggestions" className="mobile-panel-suggestions" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {MOBILE_SUGGESTIONS.map((text) => (
                  <button key={text} className="mobile-panel-suggestion" onClick={() => handleSend(text)}>
                    {text}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div className={`mobile-panel-input-wrap${isBusy ? " is-disabled" : ""}`} ref={setInputEl}>
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
              className="mobile-panel-input"
              type="text"
              placeholder="Ask navify AI Companion"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              disabled={isBusy}
            />
            <button className="mobile-panel-send" onClick={() => handleSend()} disabled={isBusy}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                <path d="M19.8671 10.2L5.86707 3.19997C5.52121 3.03254 5.13444 2.96828 4.75302 3.01489C4.3716 3.0615 4.01168 3.21699 3.71632 3.46278C3.42095 3.70857 3.20264 4.03424 3.0875 4.40084C2.97236 4.76744 2.96527 5.15944 3.06707 5.52997L5.00607 12L3.07607 18.47C2.97427 18.8405 2.98136 19.2325 3.0965 19.5991C3.21164 19.9657 3.42995 20.2914 3.72532 20.5372C4.02068 20.7829 4.3806 20.9384 4.76202 20.985C5.14344 21.0317 5.53021 20.9674 5.87607 20.8L19.8761 13.8C20.2142 13.6362 20.4994 13.3805 20.6989 13.0621C20.8985 12.7438 21.0043 12.3757 21.0043 12C21.0043 11.6243 20.8985 11.2561 20.6989 10.9378C20.4994 10.6194 20.2142 10.3637 19.8761 10.2H19.8671ZM17.0071 11H6.79707L5.00707 4.99997L17.0071 11ZM5.00707 19L6.78707 13H17.0071L5.00707 19Z" fill="currentColor" />
              </svg>
            </button>
          </div>
          <p className="mobile-panel-disclaimer">
            AI is not always infallible. <a href="#">Learn more</a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Stage2Page({ stage, onStageSelect, launcherOpen, setLauncherOpen, launcherRef }) {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="stage2-page">
      <div className="stage2-launcher" ref={launcherRef}>
        <button
          className="stage2-launcher-button"
          aria-label="Apps"
          onClick={() => setLauncherOpen((prev) => !prev)}
        >
          <AppLauncherIcon />
        </button>
        <AnimatePresence>
          {launcherOpen && (
            <motion.div
              className="app-launcher-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {STAGES.map((s) => (
                <button
                  key={s.id}
                  className={`app-launcher-item${s.id === stage ? " is-selected" : ""}`}
                  onClick={() => onStageSelect(s.id)}
                >
                  {s.label}
                </button>
              ))}
              <BrandSwitcher />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="iphone-frame"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="iphone-notch" />
        <div className="iphone-screen">
          <img className="iphone-app-img" src={iphoneAppImg} alt="iOS App" draggable={false} />
          <AnimatePresence>
            {panelOpen && (
              <motion.div
                className="mobile-panel-scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setPanelOpen(false)}
              />
            )}
            {panelOpen && <MobilePanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />}
          </AnimatePresence>
          {!panelOpen && <MobileAiButton onClick={() => setPanelOpen(true)} />}
        </div>
        <div className="iphone-home-bar" />
      </motion.div>
    </div>
  );
}

function Stage3Input({ inputEl, setInputEl, inputPath, inputViewBox, glowGradientId, inputValue, onInputChange, onKeyDown, onSend, disabled }) {
  return (
    <div className={`stage3-input-wrap${disabled ? " is-disabled" : ""}`} ref={setInputEl}>
      <svg className="stage3-input-glow" viewBox={inputViewBox} preserveAspectRatio="none" aria-hidden="true">
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
        <path d={inputPath} fill={`url(#${glowGradientId})`} />
      </svg>
      <svg className="stage3-input-shape" viewBox={inputViewBox} preserveAspectRatio="none" aria-hidden="true">
        <path d={inputPath} fill="#ffffff" />
        <path d={inputPath} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      </svg>
      <input
        className="stage3-input"
        type="text"
        placeholder="Ask navify AI Companion"
        aria-label="Ask navify AI Companion"
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />
      <button className="stage3-send" aria-label="Send" onClick={onSend} disabled={disabled}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <path d="M19.8671 10.2L5.86707 3.19997C5.52121 3.03254 5.13444 2.96828 4.75302 3.01489C4.3716 3.0615 4.01168 3.21699 3.71632 3.46278C3.42095 3.70857 3.20264 4.03424 3.0875 4.40084C2.97236 4.76744 2.96527 5.15944 3.06707 5.52997L5.00607 12L3.07607 18.47C2.97427 18.8405 2.98136 19.2325 3.0965 19.5991C3.21164 19.9657 3.42995 20.2914 3.72532 20.5372C4.02068 20.7829 4.3806 20.9384 4.76202 20.985C5.14344 21.0317 5.53021 20.9674 5.87607 20.8L19.8761 13.8C20.2142 13.6362 20.4994 13.3805 20.6989 13.0621C20.8985 12.7438 21.0043 12.3757 21.0043 12C21.0043 11.6243 20.8985 11.2561 20.6989 10.9378C20.4994 10.6194 20.2142 10.3637 19.8761 10.2H19.8671ZM17.0071 11H6.79707L5.00707 4.99997L17.0071 11ZM5.00707 19L6.78707 13H17.0071L5.00707 19Z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}

function Stage3Page() {
  const [inputEl, setInputEl] = useState(null);
  const [inputPath, setInputPath] = useState("");
  const [inputViewBox, setInputViewBox] = useState("0 0 100 56");
  const glowId = useId().replaceAll(":", "");
  const glowGradientId = `${glowId}-s3-glow`;

  const [mode, setMode] = useState("welcome");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const thinkingTimer = useRef(null);
  const responseIndex = useRef(0);
  const chatAreaRef = useRef(null);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isThinking, isTyping]);

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
          ? [{ text: "Moritz, how can I help?", sender: "ai", typed: true }, { text, sender: "user" }]
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
    if (!inputEl) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setInputPath(createScalableSquirclePath(width, height, 64));
        setInputViewBox(`0 0 ${width} ${height}`);
      }
    });
    observer.observe(inputEl);
    return () => observer.disconnect();
  }, [inputEl]);

  const isBusy = isThinking || isTyping;

  const inputProps = {
    inputEl, setInputEl, inputPath, inputViewBox, glowGradientId,
    inputValue,
    onInputChange: (e) => setInputValue(e.target.value),
    onKeyDown: (e) => { if (e.key === "Enter") handleSend(); },
    onSend: () => handleSend(),
    disabled: isBusy,
  };

  return (
    <div className="stage3-page">
      <AnimatePresence mode="popLayout">
        {mode === "welcome" ? (
          <motion.div
            key="welcome"
            className="stage3-content"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.h1
              className="stage3-greeting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              Moritz, how can I help?
            </motion.h1>
            <motion.div
              layoutId="stage3-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              style={{ width: "100%" }}
            >
              <Stage3Input {...inputProps} />
            </motion.div>
            <motion.p
              className="stage3-disclaimer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              AI is not always infallible. <a href="#">Learn more</a>
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            className="stage3-chat-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className="stage3-chat-area" ref={chatAreaRef}>
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
            </div>
            <div className="stage3-footer">
              <motion.div layoutId="stage3-input">
                <Stage3Input {...inputProps} />
              </motion.div>
              <p className="stage3-disclaimer">
                AI is not always infallible. <a href="#">Learn more</a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [panelOpen, setPanelOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [stage, setStage] = useState(1);
  const launcherRef = useRef(null);
  const [scene, setScene] = useState({
    key: 1,
    title: "Welcome",
    layout: generateLayout("home"),
  });

  useEffect(() => {
    document.title = "navify® AI Companion";
  }, [stage]);

  useEffect(() => {
    if (!launcherOpen) return;
    function handleClickOutside(e) {
      if (launcherRef.current && !launcherRef.current.contains(e.target)) {
        setLauncherOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [launcherOpen]);

  function handleStageSelect(stageId) {
    setStage(stageId);
    setLauncherOpen(false);
    if (stageId !== 3) {
      setPanelOpen(false);
    }
  }

  function handleSectionSelect(sectionId) {
    if (sectionId === activeSection) return;
    const nextItem = NAV_ITEMS.find((item) => item.id === sectionId);
    if (!nextItem) return;
    setActiveSection(sectionId);
    setScene({
      key: Date.now(),
      title: nextItem.title,
      layout: generateLayout(sectionId),
    });
  }

  return (
    <BrandProvider>
    <div className="page">
      {stage !== 2 && <header className="topbar" aria-label="navify header">
        <div className="topbar-accent" />

        <div className="topbar-inner">
          <div className="brand-group">
            {stage === 3 && <AiCompanionLogo />}
            <NavifyLogo />
            <span className="brand-title">
              {stage === 3 ? "AI Companion" : "Analytics"}
            </span>
          </div>

          <div className="actions-group">
            <div className="app-launcher-wrap" ref={launcherRef}>
              <button
                className="icon-button"
                aria-label="Apps"
                onClick={() => setLauncherOpen((prev) => !prev)}
              >
                <AppLauncherIcon />
              </button>
              <AnimatePresence>
                {launcherOpen && (
                  <motion.div
                    className="app-launcher-menu"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    {STAGES.map((s) => (
                      <button
                        key={s.id}
                        className={`app-launcher-item${s.id === stage ? " is-selected" : ""}`}
                        onClick={() => handleStageSelect(s.id)}
                      >
                        {s.label}
                      </button>
                    ))}
                    <BrandSwitcher />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="icon-button" aria-label="Notifications">
              <NotificationIcon />
            </button>
            <button className="icon-button" aria-label="Help">
              <span className="icon-help">?</span>
            </button>
            {stage === 1 && (
              <AiCompanionButton onClick={() => setPanelOpen((prev) => !prev)} />
            )}

            <span className="vertical-divider" aria-hidden="true" />

            <button className="profile-chip" aria-label="User profile">
              MH
            </button>

            <button className="roche-badge" aria-label="Roche">
              <RocheLogo />
            </button>
          </div>
        </div>
      </header>}

      {stage === 3 ? (
        <Stage3Page />
      ) : stage === 2 ? (
        <Stage2Page
          stage={stage}
          onStageSelect={handleStageSelect}
          launcherOpen={launcherOpen}
          setLauncherOpen={setLauncherOpen}
          launcherRef={launcherRef}
        />
      ) : (
        <>
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
          <CompanionPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
        </>
      )}
    </div>
    </BrandProvider>
  );
}

export default App;
