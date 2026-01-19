import { motion, useReducedMotion } from "motion/react";

interface IndicatorPosition {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

interface GlassIndicatorProps {
  style: IndicatorPosition;
}

const SPRING_STIFFNESS = 500;
const SPRING_DAMPING = 35;

const GlassIndicator = ({ style }: GlassIndicatorProps) => {
  const prefersReducedMotion = useReducedMotion();

  const initialState = prefersReducedMotion
    ? { opacity: 1, ...style }
    : { opacity: 0, ...style };

  const exitState = prefersReducedMotion ? undefined : { opacity: 0 };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING };

  return (
    <motion.span
      className="absolute rounded-2xl -z-10 pointer-events-none"
      initial={initialState}
      animate={{ opacity: 1, ...style }}
      exit={exitState}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        boxShadow: `
          inset 0 1px 1px 0 rgba(255,255,255,0.2),
          inset 0 -1px 1px 0 rgba(255,255,255,0.1),
          0 4px 12px -4px rgba(0,0,0,0.2),
          0 8px 24px -8px rgba(0,0,0,0.15)
        `,
      }}
      transition={transition}
    />
  );
};

export default GlassIndicator;
