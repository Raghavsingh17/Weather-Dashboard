import { useState } from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdRefresh, MdHome, MdCloud, MdAir, MdNotifications, MdMap, MdSettings } from "react-icons/md";
import { GiSparkles } from "react-icons/gi";

import { FaCompass } from "react-icons/fa6";

const tabs = [
  { id: "overview", label: "Overview", icon: MdHome },
  { id: "forecast", label: "Forecast", icon: MdCloud },
  { id: "air-quality", label: "Air Quality", icon: MdAir },
  { id: "activities", label: "Activities", icon: FaCompass },
  { id: "map", label: "Map / Location", icon: MdMap },
  { id: "alerts", label: "Alerts", icon: MdNotifications },
  { id: "settings", label: "Settings", icon: MdSettings },
];

function NavItem({ tab, activeTab, onTabChange, onClose, closeAfterClick, iconOnly, alertCount, preset }) {
  const Icon = tab.icon;
  const isActive = activeTab === tab.id;

  return (
    <button
      type="button"
      title={iconOnly ? tab.label : undefined}
      onClick={() => {
        onTabChange(tab.id);
        if (closeAfterClick) onClose?.();
      }}
      className={`relative flex w-full items-center rounded-2xl transition-all duration-200 ${
        iconOnly ? "justify-center px-0 py-3" : "gap-3 px-4 py-3 text-left text-sm font-semibold"
      }`}
      style={
        isActive
          ? {
              background: `linear-gradient(135deg, ${preset.accentFrom}30, ${preset.accentTo}20)`,
              borderLeft: `2px solid ${preset.accentPrimary}`,
              color: preset.accentPrimary,
              boxShadow: `0 0 20px ${preset.accentPrimary}20`,
            }
          : {
              color: "#64748b",
              borderLeft: "2px solid transparent",
            }
      }
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.color = "#94a3b8";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.color = "#64748b";
      }}
    >
      <Icon size={iconOnly ? 22 : 20} />
      {!iconOnly && <span className="flex-1 font-semibold">{tab.label}</span>}

      {/* Alert badge */}
      {tab.id === "alerts" && alertCount > 0 && (
        <span
          className={`flex items-center justify-center rounded-full bg-rose-500 font-black text-white shadow-md ${
            iconOnly ? "absolute right-1 top-1.5 h-4 w-4 text-[8px]" : "h-5 w-5 text-[10px]"
          }`}
        >
          {alertCount}
        </span>
      )}
    </button>
  );
}

export default function DashboardSidebar({
  activeTab,
  onTabChange,
  mobileOpen,
  onClose,
  alertCount = 0,
  onRefresh,
  onNavigateHome,
}) {

  const { preset, textAccentColor, sidebarStyle } = useThemeContext();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* ── Collapsed Sidebar (icon-only) ── */}
      {collapsed && (
        <aside
          className="sticky top-0 hidden h-screen w-16 shrink-0 flex-col items-center py-6 lg:flex backdrop-blur-2xl border-r z-30"
          style={sidebarStyle}
        >
          <button
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            className="mb-6 rounded-2xl p-2 text-slate-500 hover:text-slate-300 transition"
          >
            <FiChevronRight size={20} />
          </button>

          <nav className="flex w-full flex-1 flex-col items-center gap-1.5 overflow-y-auto px-2">
            {tabs.map((tab) => (
              <NavItem
                key={tab.id}
                tab={tab}
                activeTab={activeTab}
                onTabChange={onTabChange}
                onClose={onClose}
                iconOnly
                alertCount={alertCount}
                preset={preset}
              />
            ))}
          </nav>

          <div className="mt-auto flex flex-col items-center gap-2 px-2 pb-2">
            <button
              onClick={() => onRefresh?.()}
              className="rounded-2xl p-2 text-slate-500 hover:text-slate-300 transition"
              title="Refresh weather"
            >
              <MdRefresh size={20} />
            </button>
          </div>
        </aside>
      )}

      {/* ── Expanded Sidebar (w-64) ── */}
      {!collapsed && (
        <aside
          className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col px-4 py-6 lg:flex backdrop-blur-2xl border-r z-30"
          style={sidebarStyle}
        >
          {/* Logo / Brand */}
          <div
            onClick={onNavigateHome}
            className="mb-8 flex items-center gap-3 cursor-pointer group transition hover:opacity-90"
            title="Return to Landing Page"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-lg transition-transform group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
                boxShadow: `0 0 20px ${preset.accentPrimary}40`,
              }}
            >
              <GiSparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-black tracking-tight text-slate-100">
                Weatherly
              </p>
              <p className="text-[10px] text-slate-500 font-bold group-hover:text-slate-400">
                Meteorological Suite
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(true);
              }}
              title="Collapse"
              className="shrink-0 rounded-xl p-1.5 text-slate-600 hover:text-slate-400 transition"
            >
              <FiChevronLeft size={18} />
            </button>
          </div>

          {/* Section label */}
          <p className="mb-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-700">
            Navigation
          </p>

          {/* Nav items */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {tabs.map((tab) => (
              <NavItem
                key={tab.id}
                tab={tab}
                activeTab={activeTab}
                onTabChange={onTabChange}
                onClose={onClose}
                alertCount={alertCount}
                preset={preset}
              />
            ))}
          </nav>

          {/* Bottom controls */}
          <div
            className="mt-4 flex items-center gap-2 rounded-2xl p-3 border"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <span className="flex-1 text-xs font-semibold text-slate-600">Sync Weather</span>
            <button
              onClick={() => onRefresh?.()}
              className="rounded-xl p-2 text-slate-600 hover:text-slate-300 transition"
              title="Refresh weather"
            >
              <MdRefresh size={18} />
            </button>
          </div>
        </aside>
      )}

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
          <aside
            className="relative z-10 flex h-full w-64 flex-col border-r px-4 py-6 backdrop-blur-2xl"
            style={sidebarStyle}
          >
            <div className="mb-6 flex items-center justify-between">
              <div
                onClick={onNavigateHome}
                className="flex items-center gap-3 cursor-pointer transition hover:opacity-90"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
                    boxShadow: `0 0 20px ${preset.accentPrimary}40`,
                  }}
                >
                  <GiSparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
                <p className="text-lg font-black text-slate-100">
                  Weatherly
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-2xl p-1.5 text-slate-500 hover:text-slate-300 transition"
              >
                <FiChevronLeft size={20} />
              </button>
            </div>

            <p className="mb-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-700">
              Navigation
            </p>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {tabs.map((tab) => (
                <NavItem
                  key={tab.id}
                  tab={tab}
                  activeTab={activeTab}
                  onTabChange={onTabChange}
                  onClose={onClose}
                  closeAfterClick
                  alertCount={alertCount}
                  preset={preset}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
