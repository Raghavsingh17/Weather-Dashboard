// Pre-computed fixed meteor positions and timings to preserve React 19 component purity (no Math.random in render)
const METEOR_CONFIGS = [
  { top: "12%", left: "18%", delay: "0.2s", duration: "5.4s" },
  { top: "28%", left: "62%", delay: "0.6s", duration: "4.8s" },
  { top: "45%", left: "34%", delay: "1.0s", duration: "6.2s" },
  { top: "8%",  left: "85%", delay: "1.4s", duration: "5.1s" },
  { top: "60%", left: "12%", delay: "1.8s", duration: "4.5s" },
  { top: "35%", left: "78%", delay: "2.2s", duration: "5.8s" },
  { top: "18%", left: "48%", delay: "2.6s", duration: "6.0s" },
  { top: "52%", left: "92%", delay: "3.0s", duration: "4.9s" },
  { top: "72%", left: "25%", delay: "3.4s", duration: "5.5s" },
  { top: "22%", left: "5%",  delay: "3.8s", duration: "4.7s" },
  { top: "40%", left: "55%", delay: "4.2s", duration: "6.3s" },
  { top: "65%", left: "70%", delay: "4.6s", duration: "5.2s" },
  { top: "15%", left: "38%", delay: "5.0s", duration: "4.6s" },
  { top: "55%", left: "42%", delay: "5.4s", duration: "5.9s" },
  { top: "30%", left: "95%", delay: "5.8s", duration: "5.0s" },
  { top: "75%", left: "80%", delay: "6.2s", duration: "4.4s" },
  { top: "5%",  left: "68%", delay: "6.6s", duration: "6.1s" },
  { top: "48%", left: "20%", delay: "7.0s", duration: "5.3s" },
  { top: "68%", left: "58%", delay: "7.4s", duration: "4.8s" },
  { top: "82%", left: "40%", delay: "7.8s", duration: "5.7s" },
];

export default function Meteors({ number = 18 }) {
  const meteors = METEOR_CONFIGS.slice(0, number);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {meteors.map((meteor, idx) => (
        <span
          key={`meteor-${idx}`}
          className="animate-meteor absolute h-0.5 w-0.5 rounded-full bg-cyan-300 shadow-[0_0_0_1px_#ffffff20] rotate-[215deg] before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-1/2 before:w-[60px] before:h-[1px] before:bg-gradient-to-r before:from-cyan-400 before:to-transparent"
          style={{
            top: meteor.top,
            left: meteor.left,
            animationDelay: meteor.delay,
            animationDuration: meteor.duration,
          }}
        />
      ))}
    </div>
  );
}
