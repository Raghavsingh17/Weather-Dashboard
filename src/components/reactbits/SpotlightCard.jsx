import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useThemeContext } from "../../context/ThemeContext";

export default function SpotlightCard({
  children,
  className = "",
  style = {},
  spotlightColor,
  whileHoverScale = 1.01,
  onClick,
}) {
  const { cardBg, cardStyle, preset } = useThemeContext();
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const activeSpotlightColor = spotlightColor || `${preset.accentPrimary}30`;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      whileHover={{ scale: whileHoverScale, y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl transition-shadow ${cardBg} ${className}`}
      style={{
        ...cardStyle,
        ...style,
      }}
    >
      {/* ReactBits Radial Spotlight effect layer */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 z-10"
        style={{
          opacity: isFocused ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, ${activeSpotlightColor}, transparent 70%)`,
        }}
      />

      {/* Subtle border shine on cursor hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 z-10"
        style={{
          opacity: isFocused ? 1 : 0,
          border: `1.5px solid ${preset.accentPrimary}40`,
        }}
      />

      <div className="relative z-20">{children}</div>
    </motion.div>
  );
}
