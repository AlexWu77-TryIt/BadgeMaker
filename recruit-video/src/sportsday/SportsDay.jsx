import {AbsoluteFill, Html5Audio, Sequence, staticFile} from 'remotion';
import {FontGate} from '../FontGate';
import {BLUE} from '../theme';
import {CountScene, CtaScene, EndScene, HeartsScene, ShotScene, TitleScene} from './scenes';
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
            {media: {src: 'event/dodgeball.mp4', video: true, trimBefore: 0, position: '50% 60%'}, width: 720, height: 900, centerY: 720, len: 40},
          ]}
        />
      </Sequence>
      <Sequence {...seg(T2.together, T2.allout)} name="同心協力">
        <ShotScene
          seed="u2"
          caption="同心協力"
          shots={[
            {media: {src: 'event/caterpillar.mp4', video: true, trimBefore: 15}, width: 980, height: 560, len: 40},
            {media: {src: 'event/balls.jpg', position: '50% 55%'}, width: 980, height: 500, len: 40},
          ]}
        />
      </Sequence>
      <Sequence {...seg(T2.allout, T2.hearts)} name="全力以赴">
        <ShotScene
          seed="a2"
          caption="全力以赴"
          shots={[{media: {src: 'event/coach.jpg', position: '50% 40%'}, width: 760, height: 900, centerY: 720, len: 50}]}
        />
      </Sequence>
      <Sequence {...seg(T2.hearts, T2.cta)} name="五心">
        <HeartsScene />
      </Sequence>
      <Sequence {...seg(T2.cta, T2.end)} name="心動不如馬上行動">
        <CtaScene duration={T2.end - T2.cta} />
      </Sequence>
      <Sequence from={T2.end} durationInFrames={T2.total - T2.end} name="結尾">
        <EndScene />
      </Sequence>
    </FontGate>
    {/* 原創節奏（scripts/make-beat-sportsday.mjs 產生） */}
    <Html5Audio src={staticFile('beat-sportsday.wav')} />
  </AbsoluteFill>
);
