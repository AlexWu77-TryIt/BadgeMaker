import {FONT, SKEW} from '../theme';

// 斜切大字：移動時在後方拖出殘影，營造速度感
export const SpeedText = ({children, x = 0, vx = 0, size, color, ghosts = 3, style}) => {
  const base = {
    position: 'absolute',
    left: 0,
    right: 0,
    fontFamily: FONT,
    fontWeight: 900,
    fontSize: size,
    lineHeight: 1,
    color,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    ...style,
  };
  // 殘影強度隨速度遞減，停下來就完全消失，確保字清楚
  const strength = Math.min(1, Math.max(0, (Math.abs(vx) - 6) / 40));
  const moving = strength > 0;
  return (
    <>
      {moving &&
        Array.from({length: ghosts}, (_, k) => (
          <div
            key={k}
            style={{
              ...base,
              opacity: (0.3 * strength) / (k + 1),
              transform: `translateX(${x - vx * 1.3 * (k + 1)}px) skewX(${SKEW}deg)`,
            }}
          >
            {children}
          </div>
        ))}
      <div style={{...base, transform: `translateX(${x}px) skewX(${SKEW}deg)`}}>{children}</div>
    </>
  );
};
