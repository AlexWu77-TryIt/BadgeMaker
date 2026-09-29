import {AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Chevrons} from '../components/Chevrons';
import {BLUE, FONT, H, ORANGE, SKEW, T, W, WHITE} from '../theme';

const VX = W / 2; // 消失點
const VY = 820;
const clampOpt = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

// 11–13 秒：畫面加速衝向終點，橘色橫幅展開「加入格上」
export const S4Sprint = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bannerAt = T.banner - T.sprint;

  // 進場：從資訊畫面「衝進」深藍隧道
  const enter = interpolate(frame, [0, 6], [0, 1], {...clampOpt, easing: Easing.out(Easing.cubic)});
  const push = interpolate(frame, [0, 60], [1, 1.18], {easing: Easing.in(Easing.quad)});
  const shake = frame < bannerAt ? 0 : Math.sin(frame * 2.3) * interpolate(frame, [bannerAt, bannerAt + 10], [10, 0], clampOpt);

  // 橫幅
  const bannerX = interpolate(frame, [bannerAt, bannerAt + 6], [0, 1], {...clampOpt, easing: Easing.out(Easing.cubic)});
  const textIn = spring({frame: frame - bannerAt - 3, fps, config: {damping: 14, stiffness: 260, mass: 0.6}});
  const flash = interpolate(frame, [bannerAt, bannerAt + 2, bannerAt + 8], [0, 0.4, 0], clampOpt);

  return (
    <AbsoluteFill style={{overflow: 'hidden', clipPath: `circle(${enter * 150}% at ${VX}px ${VY}px)`}}>
      <AbsoluteFill style={{backgroundColor: BLUE, transform: `scale(${push}) translateY(${shake}px)`}}>
        <Road frame={frame} />
        <Streaks frame={frame} />
      </AbsoluteFill>

      {/* 橘色橫幅＋終點格紋；橫幅與文字共用同一個斜切容器，文字一定在橫幅正中間 */}
      <div
        style={{
          position: 'absolute',
          left: -60,
          right: -60,
          top: 700,
          height: 340,
          transform: `translateY(${shake}px) skewY(-6deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'left center',
            transform: `scaleX(${bannerX})`,
            background: ORANGE,
            boxShadow: '0 24px 0 rgba(0,0,0,0.18)',
          }}
        >
          <Checker style={{top: 0}} />
          <Checker style={{bottom: 0}} />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 210,
            lineHeight: 1,
            color: WHITE,
            whiteSpace: 'nowrap',
            opacity: textIn,
            transform: `scale(${2.2 - 1.2 * textIn}) skewX(${SKEW}deg)`,
          }}
        >
          加入格上
        </div>
      </div>
      <Chevrons
        count={6}
        size={80}
        color={ORANGE}
        style={{left: 90, top: 1170, opacity: frame >= bannerAt + 4 ? 1 : 0}}
      />
      <Chevrons
        count={4}
        size={60}
        color={WHITE}
        opacity={0.7}
        style={{right: 90, top: 560, opacity: frame >= bannerAt + 6 ? 0.7 : 0}}
      />
      <AbsoluteFill style={{backgroundColor: WHITE, opacity: flash}} />
    </AbsoluteFill>
  );
};

// 終點格紋（白／深藍方格兩排）
const Checker = ({style}) => {
  const s = 26;
  const cols = Math.ceil((W + 200) / s);
  return (
    <svg width={cols * s} height={s * 2} style={{position: 'absolute', left: 0, ...style}}>
      {Array.from({length: cols * 2}, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        return <rect key={i} x={c * s} y={r * s} width={s} height={s} fill={(c + r) % 2 ? BLUE : WHITE} />;
      })}
    </svg>
  );
};

// 透視路面：兩側橘色邊線＋往鏡頭衝來的白色分隔線
const Road = ({frame}) => {
  const t = frame * 0.045 + frame * frame * 0.0009; // 加速
  const dashes = Array.from({length: 10}, (_, i) => {
    const d = ((i / 10 + t) % 1) ** 2.2; // 0 遠 → 1 近
    const y = VY + d * (H - VY + 300);
    const len = 20 + d * 420;
    const w = 4 + d * 46;
    return <rect key={i} x={VX - w / 2} y={y} width={w} height={len} fill={WHITE} opacity={0.2 + 0.8 * d} />;
  });
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <polygon points={`${VX - 6},${VY} ${VX + 6},${VY} ${W + 700},${H} ${-700},${H}`} fill="rgba(255,255,255,0.07)" />
      <line x1={VX - 6} y1={VY} x2={-700} y2={H} stroke={ORANGE} strokeWidth={14} />
      <line x1={VX + 6} y1={VY} x2={W + 700} y2={H} stroke={ORANGE} strokeWidth={14} />
      {dashes}
    </svg>
  );
};

// 放射狀速度線：由消失點往外噴，越來越快
const Streaks = ({frame}) => {
  const R = 1500;
  const travel = frame * 22 + frame * frame * 0.9;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 80}, (_, i) => {
        const r = (k) => random(`st-${i}-${k}`);
        const ang = r('a') * Math.PI * 2;
        const dist = (r('d') * R + travel * (0.7 + r('v') * 0.6)) % R;
        const len = 40 + (dist / R) * 520;
        const x1 = VX + Math.cos(ang) * dist;
        const y1 = VY + Math.sin(ang) * dist;
        const x2 = VX + Math.cos(ang) * (dist + len);
        const y2 = VY + Math.sin(ang) * (dist + len);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={r('c') < 0.3 ? ORANGE : WHITE}
            strokeWidth={2 + (dist / R) * 8}
            strokeLinecap="round"
            opacity={0.25 + 0.6 * (dist / R)}
          />
        );
      })}
    </svg>
  );
};
