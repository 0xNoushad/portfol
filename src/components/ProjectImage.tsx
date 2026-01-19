import { motion, useReducedMotion } from "motion/react";

interface ProjectImageProps {
  src: string;
  alt: string;
  loading?: "lazy" | "eager";
}

const ANIMATION_DURATION = 0.15;
const INITIAL_SCALE = 0.98;
const BLUR_AMOUNT = "8px";
const MAX_IMAGE_HEIGHT = 500;

const ProjectImage = ({ src, alt, loading = "lazy" }: ProjectImageProps) => {
  const prefersReducedMotion = useReducedMotion();

  const initialState = prefersReducedMotion
    ? false
    : { opacity: 0, scale: INITIAL_SCALE, filter: `blur(${BLUR_AMOUNT})` };

  const exitState = prefersReducedMotion
    ? undefined
    : { opacity: 0, scale: INITIAL_SCALE, filter: `blur(${BLUR_AMOUNT})` };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: ANIMATION_DURATION, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <motion.div
      initial={initialState}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={exitState}
      transition={transition}
      className="w-full rounded-2xl shadow-2xl overflow-hidden"
    >
      <img 
        src={src} 
        alt={alt} 
        loading={loading}
        decoding="async"
        draggable="false"
        className="w-full h-auto" 
      />
    </motion.div>
  );
};

export default ProjectImage;
