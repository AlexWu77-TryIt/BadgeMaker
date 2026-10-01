import {Composition} from 'remotion';
import {SportsDay} from './sportsday/SportsDay';
import {T2} from './sportsday/timing';
import {Video} from './Video';
import {FPS, H, T, W} from './theme';

export const Root = () => (
  <>
    <Composition
      id="CarplusRecruit"
      component={Video}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={T.total}
    />
    <Composition
      id="SportsDay"
      component={SportsDay}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={T2.total}
    />
  </>
);
