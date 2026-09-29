import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Chevrons} from '../components/Chevrons';
import {Counter} from '../components/Counter';
import {SlashReveal} from '../components/SlashReveal';
import {SpeedLines} from '../components/SpeedLines';
import {BLUE, FONT, ORANGE, T, W, WHITE} from '../theme';

const CARD_SKEW = -8;
const clampOpt = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

// 6–11 秒：三組資訊依序跳動進場，數字計數
export const S3Info = () => (
  <SlashReveal band={BLUE}>
    <InfoBoard />
  </SlashReveal>
);

const InfoBoard = () => {
  const frame = useCurrentFrame();
  const s = T.infoStagger;
  return (
    <AbsoluteFill style={{backgroundColor: WHITE, overflow: 'hidden'}}>
      <SpeedLines seed="s3" color={BLUE} opacity={0.1} angle={-10} speed={40} count={30} />
      {/* 上方深藍斜切色帶 */}
      <svg width={W} height={400} style={{position: 'absolute', top: 0, left: 0}}>
        <polygon points={`0,0 ${W},0 ${W},170 0,330`} fill={BLUE} />
        <polygon points={`0,330 ${W},170 ${W},200 0,360`} fill={ORANGE} />
      </svg>
      <Chevrons count={4} size={60} color={WHITE} opacity={0.55} style={{right: 80, top: 60}} />
      {/* 下方色帶 */}
      <svg width={W} height={400} style={{position: 'absolute', bottom: 0, left: 0}}>
        <polygon points={`0,260 ${W},120 ${W},400 0,400`} fill={BLUE} />
        <polygon points={`0,230 ${W},90 ${W},112 0,252`} fill={ORANGE} />
      </svg>

      <Card delay={4} top={400} height={330} bg={BLUE}>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 56}}>
          <span style={{color: ORANGE, fontSize: 230, lineHeight: 1, display: 'inline-flex', alignItems: 'baseline'}}>
            <Counter to={60} start={8} duration={22} />
            <Pop at={30} style={{fontSize: 190}}>+</Pop>
          </span>
          <span style={{color: WHITE, fontSize: 140, lineHeight: 1}}>職缺</span>
        </div>
      </Card>

      <Card delay={4 + s} top={780} height={400} bg={ORANGE}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 28}}>
            <span style={{color: WHITE, fontSize: 100, lineHeight: 1}}>旅遊補助</span>
            <span style={{color: BLUE, fontSize: 72, lineHeight: 1}}>每年最高</span>
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 14, color: WHITE}}>
            <Counter to={30000} start={8 + s} duration={26} style={{fontSize: 190, lineHeight: 1}} />
            <span style={{fontSize: 100, lineHeight: 1}}>元</span>
          </div>
        </div>
      </Card>

      <Card delay={4 + 2 * s} top={1230} height={230} bg={WHITE} border={BLUE}>
        <span style={{color: BLUE, fontSize: 116, lineHeight: 1}}>多元社團活動</span>
      </Card>

      {/* 卡片左側的速度短線，隨卡片進場閃過 */}
      {[0, 1, 2].map((i) => {
        const o = interpolate(frame, [4 + i * s, 8 + i * s, 20 + i * s], [0, 1, 0], clampOpt);
        return (
          <div key={i} style={{position: 'absolute', left: 0, top: [560, 975, 1340][i], opacity: o}}>
            {[0, 1, 2].map((k) => (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: 10 + k * 18,
                  top: (k - 1) * 40,
                  width: 60 - k * 12,
                  height: 10,
                  background: ORANGE,
                  borderRadius: 5,
                }}
              />
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 資訊卡：從右下彈跳進場，斜切平行四邊形
const Card = ({delay, top, height, bg, border, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame: frame - delay, fps, config: {damping: 9, stiffness: 160, mass: 0.8}});
  const x = (1 - sp) * 700;
  const y = (1 - sp) * 160;
  const scale = 0.6 + 0.4 * sp;
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        width: W - 180,
        top,
        height,
        opacity: frame < delay ? 0 : Math.min(1, (frame - delay) / 3),
        transform: `translate(${x}px, ${y}px) scale(${scale}) skewX(${CARD_SKEW}deg)`,
        background: bg,
        border: border ? `10px solid ${border}` : undefined,
        boxSizing: 'border-box',
        boxShadow: '0 18px 0 rgba(0,52,120,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        fontWeight: 900,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
};

// 「+」在計數結束時彈出
const Pop = ({at, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame: frame - at, fps, config: {damping: 8, stiffness: 220}});
  return (
    <span style={{display: 'inline-block', transform: `scale(${sp})`, transformOrigin: 'center bottom', ...style}}>
      {children}
    </span>
  );
};
