import { HomeIcon, MonitorIcon, HistogramIcon, TaskIcon } from "./icons";

export const NAV_ITEMS = [
  { id: "home", label: "Home", title: "Welcome", Icon: HomeIcon },
  { id: "overview", label: "Overview", title: "Overview", Icon: MonitorIcon },
  { id: "analysis", label: "Analysis", title: "Analysis", Icon: HistogramIcon },
  { id: "reports", label: "Reports", title: "Reports", Icon: TaskIcon },
];

export function Sidebar({ activeSection, onSelect }) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const selected = activeSection === id;

        return (
          <button
            key={id}
            className={`sidebar-item${selected ? " selected" : ""}`}
            aria-current={selected ? "page" : undefined}
            onClick={() => onSelect(id)}
          >
            {selected ? <span className="sidebar-selection-bar" aria-hidden="true" /> : null}
            <span className="sidebar-icon-wrap">
              <Icon />
            </span>
            <span className="sidebar-label">{label}</span>
          </button>
        );
      })}
    </aside>
  );
}
