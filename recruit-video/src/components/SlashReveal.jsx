import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {H, W} from '../theme';

const SLANT = 600; // 斜切邊的傾斜量（上下差距 px）

// 斜切轉場：斜邊由左往右掃過，前方帶著一條色帶，掃過的區域露出新畫面
export const SlashReveal = ({children, band, duration = 8, bandWidth = 150}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const xTop = -bandWidth - 10 + p * (W + SLANT + bandWidth + 30);
  const xBot = xTop - SLANT;
  const clip = p < 1 ? `polygon(-10px 0, ${xTop}px 0, ${xBot}px ${H}px, -10px ${H}px)` : undefined;
  const bandPts = `${xTop},0 ${xTop + bandWidth},0 ${xBot + bandWidth},${H} ${xBot},${H}`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: clip, overflow: 'hidden'}}>{children}</AbsoluteFill>
      {p < 1 && (
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <polygon points={bandPts} fill={band} />
        </svg>
      )}
    </AbsoluteFill>
  );
};
