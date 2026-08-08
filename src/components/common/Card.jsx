export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}
