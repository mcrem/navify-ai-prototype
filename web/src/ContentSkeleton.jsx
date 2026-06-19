import { motion } from "framer-motion";

// Predefined skeleton grid configurations — each entry is a page layout
// composed of rows with N equal-width columns at given pixel heights.
const LAYOUT_LIBRARY = [
  [
    { columns: 3, heights: [160, 160, 160] },
    { columns: 2, heights: [420, 420] },
    { columns: 1, heights: [420] },
  ],
  [
    { columns: 3, heights: [160, 160, 160] },
    { columns: 1, heights: [420] },
    { columns: 3, heights: [260, 260, 260] },
    { columns: 1, heights: [360] },
  ],
  [
    { columns: 3, heights: [160, 160, 160] },
    { columns: 2, heights: [320, 320] },
    { columns: 3, heights: [240, 240, 240] },
    { columns: 1, heights: [420] },
  ],
  [
    { columns: 3, heights: [160, 160, 160] },
    { columns: 2, heights: [420, 420] },
    { columns: 2, heights: [300, 300] },
    { columns: 1, heights: [360] },
  ],
];

export function generateLayout(sectionId) {
  const base = sectionId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const randomOffset = Math.floor(Math.random() * LAYOUT_LIBRARY.length);
  return LAYOUT_LIBRARY[(base + randomOffset) % LAYOUT_LIBRARY.length];
}

function cardCountBefore(layout, rowIndex) {
  return layout
    .slice(0, rowIndex)
    .reduce((sum, row) => sum + row.heights.length, 0);
}

export function ContentSkeleton({ title, layout, sceneKey }) {
  return (
    <motion.div
      key={sceneKey}
      className="content-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <motion.div
        className="content-title-shell"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="content-title">{title}</h1>
      </motion.div>

      <section className="content-main-skeleton">
        {layout.map((row, rowIndex) => (
          <div key={`${sceneKey}-${rowIndex}`} className={`skeleton-row columns-${row.columns}`}>
            {row.heights.map((height, itemIndex) => {
              const cardIndex = cardCountBefore(layout, rowIndex) + itemIndex;
              const staggerDelay = 0.2 + cardIndex * 0.12;
              const placeholderWidth = 44 + ((rowIndex * 19 + itemIndex * 13) % 28);
              const subtitleWidth = 28 + ((rowIndex * 11 + itemIndex * 17) % 18);

              return (
                <motion.div
                  key={`${sceneKey}-${rowIndex}-${itemIndex}`}
                  className="skeleton-card"
                  style={{ minHeight: `${height}px` }}
                  initial={{ opacity: 0, y: 28, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.995 }}
                  transition={{
                    delay: staggerDelay,
                    duration: 0.58,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="skeleton-card-inner">
                    <div
                      className="skeleton-card-title-placeholder"
                      style={{ width: `${placeholderWidth}%` }}
                    />
                    {height >= 220 ? (
                      <div
                        className="skeleton-card-copy-placeholder"
                        style={{ width: `${subtitleWidth}%` }}
                      />
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </section>
    </motion.div>
  );
}
