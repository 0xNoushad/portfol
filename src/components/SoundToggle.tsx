import { useEffect, useState } from "react";
import { SpeakerSimpleHighIcon, SpeakerSimpleSlashIcon } from "@phosphor-icons/react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const ANIMATION_DURATION = 0.1;
const INITIAL_SCALE = 0.8;
const INITIAL_OPACITY = 0.8;
const BLUR_AMOUNT = "4px";

const SoundToggle = () => {
  const [isMuted, setIsMuted] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleSoundToggle = (e: CustomEvent<{ muted: boolean }>) => {
      setIsMuted(e.detail.muted);
    };
    
    window.addEventListener("sound-toggle", handleSoundToggle as EventListener);
    
    return () => {
      window.removeEventListener("sound-toggle", handleSoundToggle as EventListener);
    };
  }, []);

  const toggleSound = () => {
    const video = document.querySelector("video");
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const ariaLabel = isMuted ? "Unmute background audio" : "Mute background audio";

  const initialState = prefersReducedMotion
    ? false
    : { opacity: INITIAL_OPACITY, scale: INITIAL_SCALE, filter: `blur(${BLUR_AMOUNT})` };

  const exitState = prefersReducedMotion
    ? undefined
    : { opacity: INITIAL_OPACITY, scale: INITIAL_SCALE, filter: `blur(${BLUR_AMOUNT})` };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: ANIMATION_DURATION, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <button
      onClick={toggleSound}
      aria-label={ariaLabel}
      className="relative flex items-center justify-center size-10 rounded-full bg-button-bg backdrop-blur-sm border border-border hover:bg-button-hover transition-colors text-foreground active:scale-95 overflow-hidden cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isMuted ? "muted" : "unmuted"}
          initial={initialState}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={exitState}
          transition={transition}
          className="flex items-center justify-center"
        >
          {isMuted ? (
            <SpeakerSimpleSlashIcon aria-hidden="true" />
          ) : (
            <SpeakerSimpleHighIcon aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default SoundToggle;
