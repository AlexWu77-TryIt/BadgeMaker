import {AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Chevrons} from '../components/Chevrons';
import {SpeedLines} from '../components/SpeedLines';
import {SpeedText} from '../components/SpeedText';
import {BLUE, H, ORANGE, T, W, WHITE} from '../theme';

const WORDS = [
  {text: '成長', bg: BLUE, fg: WHITE, band: ORANGE, lines: WHITE},
  {text: '挑戰', bg: WHITE, fg: BLUE, band: ORANGE, lines: BLUE},
  {text: '轉型', bg: ORANGE, fg: WHITE, band: BLUE, lines: WHITE},
];

const SLANT = 600; // 斜切邊的傾斜量（上下差距 px）
const BAND = 150; // 領頭色帶寬度

// 2–6 秒：三個大字依序斜切進場
export const S2Words = () => {
  const sceneLen = T.info - T.words + 10;
  return (
    <AbsoluteFill>
      {WORDS.map((w, i) => (
        <Sequence key={w.text} from={i * T.wordLen} durationInFrames={sceneLen - i * T.wordLen} name={w.text}>
          <WordCard {...w} seed={i} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const WordCard = ({text, bg, fg, band, lines, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 斜切轉場：斜邊由左往右掃過，前方帶著一條色帶
  const p = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const xTop = -BAND - 10 + p * (W + SLANT + BAND + 30);
  const xBot = xTop - SLANT;
  const clip = `polygon(-10px 0, ${xTop}px 0, ${xBot}px ${H}px, -10px ${H}px)`;
  const bandPts = `${xTop},0 ${xTop + BAND},0 ${xBot + BAND},${H} ${xBot},${H}`;

  // 大字由左甩入
  const posX = (f) => {
    const s = spring({frame: f - 2, fps, config: {damping: 22, stiffness: 220, mass: 0.7}});
    return -1150 * (1 - s) + Math.max(0, f - 2) * 0.8;
  };
  const x = posX(frame);
  const vx = x - posX(frame - 1);

  // 字後方的斜切色帶
  const bandIn = interpolate(frame, [5, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: clip, backgroundColor: bg, overflow: 'hidden'}}>
        <SpeedLines seed={`w${seed}`} color={lines} opacity={0.16} angle={-10} speed={60} count={34} />
        <div
          style={{
            position: 'absolute',
            left: -100,
            top: 1010,
            width: 1300,
            height: 120,
            background: band,
            transformOrigin: 'left center',
            transform: `skewX(-30deg) scaleX(${bandIn})`,
          }}
        />
        <SpeedText x={x} vx={vx} size={420} color={fg} style={{top: 690}}>
          {text}
        </SpeedText>
        <Chevrons count={5} size={84} color={band} style={{left: 90, top: 1250}} />
        <Chevrons count={3} size={56} color={lines} opacity={0.45} style={{right: 90, top: 520}} />
      </AbsoluteFill>
      {p < 1 && (
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <polygon points={bandPts} fill={band} />
        </svg>
      )}
    </AbsoluteFill>
  );
};
