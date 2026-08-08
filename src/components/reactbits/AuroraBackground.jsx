import { useThemeContext } from "../../context/ThemeContext";

export default function AuroraBackground({ children }) {
  const { preset } = useThemeContext();

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden font-sans"
      style={{ backgroundColor: preset.bgBase, color: "#e2e8f0" }}
    >
      {/* ── ReactBits Animated Aurora Gradient Mesh ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60">
        <div
          className="absolute -left-40 -top-40 h-[700px] w-[700px] rounded-full blur-[140px] transition-all duration-1000 animate-pulse"
          style={{ background: `radial-gradient(circle, ${preset.accentPrimary}30, transparent 70%)` }}
        />
        <div
          className="absolute -right-40 top-1/4 h-[700px] w-[700px] rounded-full blur-[140px] transition-all duration-1000"
          style={{ background: `radial-gradient(circle, ${preset.accentSecondary}25, transparent 70%)` }}
        />
        <div
          className="absolute bottom-10 left-1/3 h-[600px] w-[600px] rounded-full blur-[140px] transition-all duration-1000"
          style={{ background: `radial-gradient(circle, ${preset.accentFrom}20, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
