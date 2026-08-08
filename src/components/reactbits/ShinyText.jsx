import { useThemeContext } from "../../context/ThemeContext";

export default function ShinyText({ children, className = "", style = {} }) {
  const { preset } = useThemeContext();

  return (
    <span
      className={`inline-block bg-clip-text text-transparent transition-all ${className}`}
      style={{
        backgroundImage: `linear-gradient(110deg, #ffffff 0%, ${preset.accentPrimary} 45%, #ffffff 55%, #ffffff 100%)`,
        backgroundSize: "200% 100%",
        animation: "shine-sweep 5s linear infinite",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
