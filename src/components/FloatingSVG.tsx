interface Props {
  svg: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size?: 'sm' | 'md' | 'lg';
  rotate?: number;
}

export default function FloatingSVG({ 
  svg, 
  top,
  left,
  right,
  bottom,
  size = 'md',
  rotate = 0
}: Props) {
  const sizeClasses = {
    sm: 'w-12 h-12 sm:w-16 sm:h-16',
    md: 'w-16 h-16 sm:w-24 sm:h-24',
    lg: 'w-24 h-24 sm:w-32 sm:h-32'
  };

  const style: React.CSSProperties = {
    transform: `rotate(${rotate}deg)`,
    ...(top && { top }),
    ...(left && { left }),
    ...(right && { right }),
    ...(bottom && { bottom })
  };

  return (
    <div 
      className={`hidden md:block fixed pointer-events-none z-0 opacity-15 dark:opacity-25 brightness-50 dark:brightness-100 dark:invert ${sizeClasses[size]}`}
      style={style}
    >
      <img src={svg} alt="" className="w-full h-full" loading="lazy" />
    </div>
  );
}
