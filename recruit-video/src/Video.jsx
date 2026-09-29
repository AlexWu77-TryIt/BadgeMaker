import {AbsoluteFill, Sequence} from 'remotion';
import {FontGate} from './FontGate';
import {S1Opening} from './scenes/S1Opening';
import {S2Words} from './scenes/S2Words';
import {BLUE, T} from './theme';

export const Video = () => (
  <AbsoluteFill style={{backgroundColor: BLUE}}>
    <FontGate>
      <Sequence from={T.opening} durationInFrames={T.words + 10} name="0–2秒 開場">
        <S1Opening />
      </Sequence>
      <Sequence from={T.words} durationInFrames={T.info - T.words + 10} name="2–6秒 三大字">
        <S2Words />
      </Sequence>
    </FontGate>
  </AbsoluteFill>
);
