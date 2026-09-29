import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

// 速度線：一群往「前方」（右上）流動的細線，角度與速度可調
export const SpeedLines = ({
  count = 36,
  color = '#fff',
  opacity = 0.14,
  angle = -20,
  speed = 40,
  accel = 0,
  seed = 'lines',
  minLen = 160,
  maxLen = 560,
  minThick = 2,
  maxThick = 7,
}) => {
  const frame = useCurrentFrame();
  const S = 2800;
  const travel = speed * frame + (accel * frame * frame) / 2;
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: S,
          height: S,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        }}
      >
        {Array.from({length: count}, (_, i) => {
          const r = (k) => random(`${seed}-${i}-${k}`);
          const len = minLen + r('len') * (maxLen - minLen);
          const thick = minThick + r('th') * (maxThick - minThick);
          const span = S + len;
          const x = ((r('x') * span + travel * (0.6 + r('v') * 0.8)) % span) - len;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: r('y') * S,
                width: len,
                height: thick,
                borderRadius: thick,
                background: `linear-gradient(90deg, transparent, ${color})`,
                opacity: opacity * (0.5 + r('o') * 0.5),
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
