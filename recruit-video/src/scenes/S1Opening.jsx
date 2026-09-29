import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Chevrons} from '../components/Chevrons';
import {LightTrail} from '../components/LightTrail';
import {SpeedLines} from '../components/SpeedLines';
import {SpeedText} from '../components/SpeedText';
import {BLUE, ORANGE, WHITE} from '../theme';

// 0–2 秒：深藍底，橘色光軌劃過，「你的第一站，想去哪？」
export const S1Opening = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const slideX = (f, delay, from) => {
    const s = spring({frame: f - delay, fps, config: {damping: 15, stiffness: 190, mass: 0.8}});
    return from * (1 - s) + Math.max(0, f - delay) * 0.4;
  };
  const x1 = slideX(frame, 10, -1300);
  const x2 = slideX(frame, 17, -1300);
  const v1 = x1 - slideX(frame - 1, 10, -1300);
  const v2 = x2 - slideX(frame - 1, 17, -1300);

  const zoom = interpolate(frame, [0, 70], [1, 1.04]);

  return (
    <AbsoluteFill style={{backgroundColor: BLUE, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <SpeedLines seed="s1" color={WHITE} opacity={0.16} angle={-28} speed={34} count={42} />
        {/* 淡白斜切色帶 */}
        <div
          style={{
            position: 'absolute',
            left: -300,
            right: -300,
            top: 700,
            height: 520,
            background: 'rgba(255,255,255,0.06)',
            transform: 'rotate(-28deg)',
          }}
        />
        <LightTrail start={4} duration={14} angle={-28} offsetY={60} />
        <SpeedText x={x1} vx={v1} size={140} color={WHITE} style={{top: 740}}>
          你的第一站，
        </SpeedText>
        <SpeedText x={x2} vx={v2} size={220} color={ORANGE} style={{top: 920}}>
          想去哪？
        </SpeedText>
        <Chevrons
          count={5}
          size={70}
          color={ORANGE}
          style={{left: 110, top: 1230, opacity: interpolate(frame, [22, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
