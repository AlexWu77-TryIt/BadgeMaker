import {Composition} from 'remotion';
import {Video} from './Video';
import {FPS, H, T, W} from './theme';

export const Root = () => (
  <Composition
    id="CarplusRecruit"
    component={Video}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={T.total}
  />
);
