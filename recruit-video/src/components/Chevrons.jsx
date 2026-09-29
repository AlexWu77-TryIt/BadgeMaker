import {useCurrentFrame} from 'remotion';

// 箭頭列：＞＞＞＞ 依序亮起、往前推進
export const Chevrons = ({count = 4, size = 80, color = '#fff', gap = 10, style, speed = 0.55, opacity = 1}) => {
  const frame = useCurrentFrame();
  const w = size * 0.75;
  const step = w * 0.62 + gap;
  const shift = ((frame * size) / 12) % step;
  return (
    <svg
      width={step * count + w}
      height={size}
      viewBox={`0 0 ${step * count + w} ${size}`}
      style={{position: 'absolute', overflow: 'hidden', opacity, ...style}}
    >
      {Array.from({length: count}, (_, i) => {
        const x = i * step + shift;
        const pulse = 0.3 + 0.7 * ((Math.sin(frame * speed - i * 0.9) + 1) / 2);
        const t = w * 0.38;
        const pts = [
          [x, 0],
          [x + t, 0],
          [x + w, size / 2],
          [x + t, size],
          [x, size],
          [x + w - t, size / 2],
        ]
          .map((p) => p.join(','))
          .join(' ');
        return <polygon key={i} points={pts} fill={color} opacity={pulse} />;
      })}
    </svg>
  );
};
