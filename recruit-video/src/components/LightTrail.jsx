import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {ORANGE} from '../theme';

// 光軌：一道高速劃過的橘色光，劃過後留下淡淡殘光
export const LightTrail = ({
  start = 4,
  duration = 14,
  angle = -28,
  offsetY = 0,
  color = ORANGE,
  thickness = 16,
  trailLength = 1500,
  residue = 0.35,
}) => {
  const frame = useCurrentFrame();
  const L = 3400;
  const p = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.55, 0, 0.25, 1),
  });
  const headX = -200 + p * (L + trailLength + 200);
  const visible = frame >= start;
  const residueOpacity = interpolate(
    frame,
    [start, start + duration, start + duration + 16],
    [1, 0.8, residue],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const bar = (h, extra) => ({
    position: 'absolute',
    top: '50%',
    height: h,
    marginTop: -h / 2,
    borderRadius: h,
    ...extra,
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none', opacity: visible ? 1 : 0}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: `calc(50% + ${offsetY}px)`,
          width: L,
          height: 400,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        }}
      >
        {/* 殘光 */}
        <div
          style={bar(thickness * 0.4, {
            left: 0,
            width: Math.max(0, headX),
            background: color,
            opacity: residueOpacity,
            boxShadow: `0 0 24px ${color}`,
          })}
        />
        {/* 光暈 */}
        <div
          style={bar(thickness * 4, {
            left: headX - trailLength,
            width: trailLength,
            background: `linear-gradient(90deg, transparent, ${color}88 70%, ${color})`,
            filter: 'blur(22px)',
          })}
        />
        {/* 光軌本體 */}
        <div
          style={bar(thickness, {
            left: headX - trailLength,
            width: trailLength,
            background: `linear-gradient(90deg, transparent, ${color} 65%, #FFD8C8 96%, #fff)`,
          })}
        />
        {/* 光頭 */}
        <div
          style={bar(thickness * 2.2, {
            left: headX - thickness * 2.2,
            width: thickness * 2.2,
            background: '#fff',
            boxShadow: `0 0 30px 12px ${color}, 0 0 80px 30px ${color}99`,
          })}
        />
      </div>
    </AbsoluteFill>
  );
};
