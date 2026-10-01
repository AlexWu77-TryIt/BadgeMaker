import {AbsoluteFill} from 'remotion';
import {Chevrons} from '../components/Chevrons';
import {SpeedLines} from '../components/SpeedLines';
import {BLUE, ORANGE, W, WHITE} from '../theme';

// 照片段落的共用背景：深藍底、速度線、斜切色帶、箭頭
export const Backdrop = ({seed, bg = BLUE, accent = ORANGE}) => (
  <AbsoluteFill style={{backgroundColor: bg, overflow: 'hidden'}}>
    <SpeedLines seed={seed} color={WHITE} opacity={0.14} angle={-10} speed={50} count={30} />
    <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
      <polygon points={`0,520 ${W},300 ${W},420 0,640`} fill="rgba(255,255,255,0.06)" />
      <polygon points={`0,1080 ${W},860 ${W},930 0,1150`} fill={accent} />
    </svg>
    <Chevrons count={3} size={56} color={WHITE} opacity={0.5} style={{right: 80, top: 200}} />
  </AbsoluteFill>
);
