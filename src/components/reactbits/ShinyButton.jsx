import { motion } from "framer-motion";
import { useThemeContext } from "../../context/ThemeContext";

export default function ShinyButton({
  children,
  onClick,
  type = "button",
  className = "",
  style = {},
  disabled = false,
}) {
  const { preset } = useThemeContext();

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`group relative overflow-hidden rounded-full font-black text-white shadow-lg transition-all ${className}`}
      style={{
        background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
        boxShadow: `0 0 20px ${preset.accentPrimary}40`,
        ...style,
      }}
    >
      {/* ReactBits Sheen Shine Sweep Effect */}
      <span className="pointer-events-none absolute -inset-full top-0 block h-full w-[200%] -rotate-45 transform bg-gradient-to-r from-transparent via-white/35 to-transparent transition-all duration-1000 group-hover:translate-x-full" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
