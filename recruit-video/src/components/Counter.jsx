import {Easing, interpolate, useCurrentFrame} from 'remotion';

// 計數數字：從 0 跳到目標值；每個數字固定寬度，跳動時整排不會左右晃
export const Counter = ({to, start, duration, style}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + duration], [0, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const text = Math.round(v).toLocaleString('en-US');
  const target = to.toLocaleString('en-US');
  // 位數不足時左側補空白佔位，讓數字在卡片中的位置固定
  const padded = text.padStart(target.length, ' ');
  return (
    <span style={{display: 'inline-flex', ...style}}>
      {padded.split('').map((ch, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: ch === ',' || target[i] === ',' ? '0.3em' : '0.6em',
            textAlign: 'center',
          }}
        >
          {ch === ' ' ? '' : ch}
        </span>
      ))}
    </span>
  );
};
