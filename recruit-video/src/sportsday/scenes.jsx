import {AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Chevrons} from '../components/Chevrons';
import {Counter} from '../components/Counter';
import {LightTrail} from '../components/LightTrail';
import {SlashReveal} from '../components/SlashReveal';
import {SpeedLines} from '../components/SpeedLines';
import {SpeedText} from '../components/SpeedText';
import {BLUE, FONT, ORANGE, SKEW, WHITE} from '../theme';
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
