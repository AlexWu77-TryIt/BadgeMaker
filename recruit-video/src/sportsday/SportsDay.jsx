import {AbsoluteFill, Html5Audio, Sequence, staticFile} from 'remotion';
import {FontGate} from '../FontGate';
import {BLUE} from '../theme';
import {CountScene, ShotScene, TitleScene} from './scenes';
import {T2, TEXT2} from './timing';

const seg = (from, to) => ({from, durationInFrames: to - from + 10});

export const SportsDay = () => (
  <AbsoluteFill style={{backgroundColor: BLUE}}>
    <FontGate text={TEXT2}>
      <Sequence {...seg(T2.title, T2.count)} name="標題">
        <TitleScene />
      </Sequence>
      <Sequence {...seg(T2.count, T2.move)} name="超過150人參加">
        <CountScene duration={T2.move - T2.count} />
      </Sequence>
      <Sequence {...seg(T2.move, T2.together)} name="一起動起來">
        <ShotScene
          seed="m2"
          caption="一起動起來"
          shots={[
            {media: {src: 'event/dance.jpg', position: '45% 40%'}, width: 980, height: 660, len: 40},
            {media: {src: 'event/dodgeball.mp4', video: true, trimBefore: 0, position: '50% 60%'}, width: 720, height: 900, len: 40},
          ]}
        />
      </Sequence>
    </FontGate>
    {/* 原創節奏（scripts/make-beat-sportsday.mjs 產生） */}
    <Html5Audio src={staticFile('beat-sportsday.wav')} />
  </AbsoluteFill>
);
