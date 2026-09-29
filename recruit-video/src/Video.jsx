import {AbsoluteFill, Html5Audio, Sequence, staticFile} from 'remotion';
import {FontGate} from './FontGate';
import {S1Opening} from './scenes/S1Opening';
import {S2Words} from './scenes/S2Words';
import {S3Info} from './scenes/S3Info';
import {S4Sprint} from './scenes/S4Sprint';
import {S5End} from './scenes/S5End';
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
      <Sequence from={T.info} durationInFrames={T.sprint - T.info + 8} name="6–11秒 三組資訊">
        <S3Info />
      </Sequence>
      <Sequence from={T.sprint} durationInFrames={T.end - T.sprint} name="11–13秒 加入格上">
        <S4Sprint />
      </Sequence>
      <Sequence from={T.end} durationInFrames={T.total - T.end} name="13–15秒 結尾">
        <S5End />
      </Sequence>
    </FontGate>
    {/* 原創節奏（scripts/make-beat.mjs 產生）；之後換成授權音樂只要換檔 */}
    <Html5Audio src={staticFile('beat.wav')} />
  </AbsoluteFill>
);
