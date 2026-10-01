import {AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Chevrons} from '../components/Chevrons';
import {Counter} from '../components/Counter';
import {LightTrail} from '../components/LightTrail';
import {QrCode} from '../components/QrCode';
import {SlashReveal} from '../components/SlashReveal';
import {SpeedLines} from '../components/SpeedLines';
import {SpeedText} from '../components/SpeedText';
import {BLUE, FONT, ORANGE, QR_URL, SKEW, WHITE} from '../theme';
import {Backdrop} from './Backdrop';
import {PhotoCard} from './PhotoCard';

const clampOpt = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

// 由左甩入的位移（含殘影速度）
const useSlideIn = (delay, from = -1200) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pos = (f) => {
    const s = spring({frame: f - delay, fps, config: {damping: 20, stiffness: 220, mass: 0.7}});
    return from * (1 - s) + Math.max(0, f - delay) * 0.4;
  };
  const x = pos(frame);
  return {x, vx: x - pos(frame - 1)};
};

// 0–1.7 秒：活動名稱
export const TitleScene = () => {
  const frame = useCurrentFrame();
  const a = useSlideIn(6);
  const b = useSlideIn(10);
  const c = useSlideIn(14);
  const tag = spring({frame: frame - 22, fps: 30, config: {damping: 12, stiffness: 220}});
  return (
    <AbsoluteFill style={{backgroundColor: BLUE, overflow: 'hidden'}}>
      <SpeedLines seed="t2" color={WHITE} opacity={0.16} angle={-28} speed={34} count={42} />
      <LightTrail start={2} duration={12} angle={-28} offsetY={40} />
      <SpeedText x={a.x} vx={a.vx} size={170} color={ORANGE} style={{top: 470}}>
        2026
      </SpeedText>
      <SpeedText x={b.x} vx={b.vx} size={210} color={WHITE} style={{top: 660}}>
        五心相<span style={{color: ORANGE}}>IN</span>
      </SpeedText>
      <SpeedText x={c.x} vx={c.vx} size={210} color={WHITE} style={{top: 890}}>
        運動會
      </SpeedText>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1150,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${tag}) skewX(${SKEW}deg)`,
        }}
      >
        <div style={{background: ORANGE, color: WHITE, fontFamily: FONT, fontWeight: 900, fontSize: 76, lineHeight: 1, padding: '18px 40px'}}>
          2026.09.12
        </div>
      </div>
      <Chevrons count={5} size={64} color={ORANGE} style={{left: 110, top: 1320, opacity: interpolate(frame, [24, 30], [0, 1], clampOpt)}} />
    </AbsoluteFill>
  );
};

// 1.7–3.7 秒：全員暖身照＋「超過 150 人參加」
export const CountScene = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const row = spring({frame: frame - 6, fps, config: {damping: 18, stiffness: 220}});
  const word = {fontSize: 92, color: WHITE};
  return (
    <SlashReveal band={ORANGE}>
      <Backdrop seed="c2" />
      <PhotoCard media={{src: 'event/warmup.jpg', position: '40% 50%'}} width={980} height={620} centerY={640} duration={duration} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1190,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          gap: 20,
          fontFamily: FONT,
          fontWeight: 900,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          opacity: row,
          transform: `translateX(${(1 - row) * -400}px) skewX(${SKEW}deg)`,
        }}
      >
        <span style={word}>超過</span>
        <Counter to={150} start={8} duration={32} style={{fontSize: 230, color: ORANGE}} />
        <span style={word}>人參加</span>
      </div>
    </SlashReveal>
  );
};

// 照片／影片段落：一句大字標題，底下依序切換 1–2 個畫面
// shots: [{media, width, height, len}]
export const ShotScene = ({caption, shots, seed, band = ORANGE}) => {
  const cap = useSlideIn(4);
  let start = 0;
  return (
    <SlashReveal band={band}>
      <Backdrop seed={seed} />
      {shots.map((s, i) => {
        const from = start;
        start += s.len;
        return (
          <Sequence key={i} from={from} durationInFrames={s.len + (i < shots.length - 1 ? 6 : 0)} layout="none">
            {i === 0 ? (
              <PhotoCard media={s.media} width={s.width} height={s.height} centerY={s.centerY ?? 690} duration={s.len} />
            ) : (
              <SlashReveal band={WHITE} duration={6} bandWidth={90}>
                <PhotoCard media={s.media} width={s.width} height={s.height} centerY={s.centerY ?? 690} duration={s.len} />
              </SlashReveal>
            )}
          </Sequence>
        );
      })}
      <SpeedText x={cap.x} vx={cap.vx} size={170} color={WHITE} style={{top: 1260}}>
        {caption}
      </SpeedText>
    </SlashReveal>
  );
};

// 10.7–12.3 秒：五心。畫面依序掃過五面旗，每一拍一個心
const HEARTS = ['誠心', '用心', '齊心', '關心', '信心'];
// 五面旗在原圖（2576×1932）中的水平中心
const BANNER_X = [180, 859, 1269, 1709, 2370];
const IMG_W = 2576;
const WIN_H = 700; // 取景窗高度（原圖像素），涵蓋整面旗
const WIN_Y = 390;

export const HeartsScene = ({beat = 10}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cardW = 980;
  const cardH = 880;
  const winW = (WIN_H * (cardW - 24)) / (cardH - 24);
  const scale = (cardW - 24) / winW;
  const x0 = (i) => Math.min(IMG_W - winW, Math.max(0, BANNER_X[i] - winW / 2));
  const idx = Math.min(HEARTS.length - 1, Math.floor(frame / beat));
  const local = frame - idx * beat;
  const prevX = x0(Math.max(0, idx - 1));
  const curX = idx === 0 ? x0(0) : interpolate(local, [0, 4], [prevX, x0(idx)], {...clampOpt});
  const pop = spring({frame: local, fps, config: {damping: 10, stiffness: 320, mass: 0.5}});

  return (
    <SlashReveal band={ORANGE}>
      <Backdrop seed="h2" />
      <PanCard x={curX} scale={scale} width={cardW} height={cardH} centerY={650} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1150,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 260,
          lineHeight: 1,
          color: WHITE,
          transform: `scale(${0.6 + 0.4 * pop}) skewX(${SKEW}deg)`,
        }}
      >
        {HEARTS[idx]}
      </div>
      {/* 五心進度列：已出現的白色、目前的橘色、還沒出現的淡色 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1450,
          display: 'flex',
          justifyContent: 'center',
          gap: 30,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 56,
          lineHeight: 1,
          transform: `skewX(${SKEW}deg)`,
        }}
      >
        {HEARTS.map((h, i) => (
          <span key={h} style={{color: i === idx ? ORANGE : WHITE, opacity: i <= idx ? 1 : 0.25}}>
            {h}
          </span>
        ))}
      </div>
    </SlashReveal>
  );
};

// 五心專用的取景卡：在大圖上平移取景（不縮放變形）
const PanCard = ({x, scale, width, height, centerY}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame, fps, config: {damping: 16, stiffness: 180, mass: 0.7}});
  const clip = 'polygon(0 46px, 100% 0, 100% calc(100% - 46px), 0 100%)';
  return (
    <div
      style={{
        position: 'absolute',
        left: (1080 - width) / 2,
        top: centerY - height / 2,
        width,
        height,
        opacity: Math.min(1, sp * 2),
        transform: `translateX(${(1 - sp) * 260}px)`,
      }}
    >
      <div style={{position: 'absolute', inset: 0, transform: 'translate(22px, 26px)', background: ORANGE, clipPath: clip}} />
      <div style={{position: 'absolute', inset: 0, background: WHITE, clipPath: clip}} />
      <div style={{position: 'absolute', inset: 12, overflow: 'hidden', clipPath: clip}}>
        <Img
          src={staticFile('event/banners.jpg')}
          style={{position: 'absolute', width: IMG_W * scale, left: -x * scale, top: -WIN_Y * scale, maxWidth: 'none'}}
        />
      </div>
    </div>
  );
};

// 12.3–13.3 秒：團體合照＋「心動不如馬上行動」
export const CtaScene = ({duration}) => {
  const a = useSlideIn(3);
  const b = useSlideIn(7);
  return (
    <SlashReveal band={WHITE}>
      <Backdrop seed="g2" />
      <PhotoCard media={{src: 'event/group.jpg', position: '50% 55%', zoom: [1.0, 1.05]}} width={980} height={720} centerY={640} duration={duration} />
      <SpeedText x={a.x} vx={a.vx} size={150} color={WHITE} style={{top: 1130}}>
        心動不如
      </SpeedText>
      <SpeedText x={b.x} vx={b.vx} size={150} color={ORANGE} style={{top: 1300}}>
        馬上行動
      </SpeedText>
    </SlashReveal>
  );
};

// 13.3–15 秒：白底結尾定格：Logo、加入移動服務團隊、QR Code、上 104 搜尋
export const EndScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flash = interpolate(frame, [0, 8], [1, 0], clampOpt);
  const band = interpolate(frame, [2, 9], [0, 1], clampOpt);
  const logo = spring({frame: frame - 2, fps, config: {damping: 16, stiffness: 200}});
  const t1 = spring({frame: frame - 5, fps, config: {damping: 18, stiffness: 240}});
  const qr = spring({frame: frame - 8, fps, config: {damping: 12, stiffness: 200}});
  const t2 = spring({frame: frame - 11, fps, config: {damping: 18, stiffness: 240}});
  const deco = interpolate(frame, [4, 12], [0, 1], clampOpt);
  const QR = 400;
  const QR_TOP = 880;
  return (
    <AbsoluteFill style={{backgroundColor: WHITE, overflow: 'hidden'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: deco}}>
        <polygon points="0,0 1080,0 1080,90 0,210" fill={BLUE} />
        <polygon points="0,210 1080,90 1080,118 0,238" fill={ORANGE} />
        <polygon points="0,1740 1080,1580 1080,1920 0,1920" fill={BLUE} />
        <polygon points="0,1710 1080,1550 1080,1572 0,1732" fill={ORANGE} />
      </svg>
      {/* 格上 Logo（使用者提供的原檔，不重繪） */}
      <Img
        src={staticFile('event/logo.png')}
        style={{position: 'absolute', left: 140, top: 300, width: 800, opacity: logo, transform: `scale(${0.85 + 0.15 * logo})`}}
      />
      {/* 深藍斜切色帶＋加入移動服務團隊 */}
      <div style={{position: 'absolute', left: -40, right: -40, top: 590, height: 210, transform: 'skewY(-5deg)'}}>
        <div style={{position: 'absolute', inset: 0, background: BLUE, transformOrigin: 'left center', transform: `scaleX(${band})`}} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 100,
            lineHeight: 1,
            color: WHITE,
            whiteSpace: 'nowrap',
            opacity: t1,
            transform: `translateX(${(1 - t1) * -300}px) skewX(${SKEW}deg)`,
          }}
        >
          加入移動服務團隊
        </div>
      </div>
      {/* QR Code */}
      <div style={{position: 'absolute', left: (1080 - QR) / 2, top: QR_TOP, width: QR, height: QR, transform: `scale(${qr})`}}>
        <QrCode value={QR_URL} size={QR} color={BLUE} background={WHITE} />
        {[
          {left: -24, top: -24, borderLeft: 1, borderTop: 1},
          {right: -24, top: -24, borderRight: 1, borderTop: 1},
          {left: -24, bottom: -24, borderLeft: 1, borderBottom: 1},
          {right: -24, bottom: -24, borderRight: 1, borderBottom: 1},
        ].map(({borderLeft, borderTop, borderRight, borderBottom, ...pos}, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 80,
              height: 80,
              ...pos,
              borderLeft: borderLeft && `13px solid ${ORANGE}`,
              borderTop: borderTop && `13px solid ${ORANGE}`,
              borderRight: borderRight && `13px solid ${ORANGE}`,
              borderBottom: borderBottom && `13px solid ${ORANGE}`,
            }}
          />
        ))}
      </div>
      <Chevrons count={3} size={64} color={ORANGE} still style={{left: 80, top: QR_TOP + QR / 2 - 32, opacity: deco}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1350,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 80,
          lineHeight: 1,
          color: BLUE,
          whiteSpace: 'nowrap',
          opacity: t2,
          transform: `translateY(${(1 - t2) * 40}px) skewX(${SKEW}deg)`,
        }}
      >
        上 <span style={{color: ORANGE}}>104</span> 搜尋：格上租車
      </div>
      <AbsoluteFill style={{backgroundColor: WHITE, opacity: flash}} />
    </AbsoluteFill>
  );
};
