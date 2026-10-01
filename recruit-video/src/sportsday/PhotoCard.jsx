import {Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ORANGE, W, WHITE} from '../theme';

const SLANT = 46; // 上下斜邊的高低差（px）
const BORDER = 12;

const slantClip = (s) => `polygon(0 ${s}px, 100% 0, 100% calc(100% - ${s}px), 0 100%)`;

// 斜切照片卡：只用裁切遮罩做出斜邊，照片本身不變形
// media: {src, video?, trimBefore?, position?, zoom?: [from, to]}
export const PhotoCard = ({media, width, height, centerY = 740, duration = 40, enterDelay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame: frame - enterDelay, fps, config: {damping: 16, stiffness: 180, mass: 0.7}});
  const [z0, z1] = media.zoom ?? [1.0, 1.08];
  const zoom = interpolate(frame, [0, duration], [z0, z1], {extrapolateRight: 'clamp'});
  const left = (W - width) / 2;
  const top = centerY - height / 2;
  const fill = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: media.position ?? '50% 50%',
    transform: `scale(${zoom})`,
    transformOrigin: media.position ?? '50% 50%',
  };
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        opacity: Math.min(1, sp * 2),
        transform: `translateX(${(1 - sp) * 260}px) scale(${0.88 + 0.12 * sp})`,
      }}
    >
      {/* 橘色斜切陰影 */}
      <div style={{position: 'absolute', inset: 0, transform: 'translate(22px, 26px)', background: ORANGE, clipPath: slantClip(SLANT)}} />
      {/* 白框 */}
      <div style={{position: 'absolute', inset: 0, background: WHITE, clipPath: slantClip(SLANT)}} />
      <div style={{position: 'absolute', inset: BORDER, overflow: 'hidden', clipPath: slantClip(SLANT - 4)}}>
        {media.video ? (
          <OffthreadVideo src={staticFile(media.src)} trimBefore={media.trimBefore ?? 0} muted style={fill} />
        ) : (
          <Img src={staticFile(media.src)} style={fill} />
        )}
      </div>
    </div>
  );
};
