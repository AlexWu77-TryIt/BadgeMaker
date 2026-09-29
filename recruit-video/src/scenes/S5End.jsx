import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Chevrons} from '../components/Chevrons';
import {QrCode} from '../components/QrCode';
import {BLUE, FONT, ORANGE, QR_URL, SKEW, W, WHITE} from '../theme';

const clampOpt = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const QR_SIZE = 460;
const QR_TOP = 860;

// 13–15 秒：結尾定格「上 104 搜尋：台灣格上租車」＋ QR Code
// （Logo 暫不放；之後放進 public/ 再加在上方 y≈280–380 的位置）
export const S5End = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flash = interpolate(frame, [0, 8], [1, 0], clampOpt);
  const band = interpolate(frame, [0, 7], [0, 1], clampOpt);
  const t1 = spring({frame: frame - 3, fps, config: {damping: 18, stiffness: 240}});
  const t2 = spring({frame: frame - 6, fps, config: {damping: 18, stiffness: 240}});
  const qr = spring({frame: frame - 9, fps, config: {damping: 12, stiffness: 200}});
  const deco = interpolate(frame, [6, 14], [0, 1], clampOpt);


  return (
    <AbsoluteFill style={{backgroundColor: WHITE, overflow: 'hidden'}}>
      {/* 上方與角落斜切色帶 */}
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0, opacity: deco}}>
        <polygon points={`0,0 ${W},0 ${W},90 0,210`} fill={BLUE} />
        <polygon points={`0,210 ${W},90 ${W},118 0,238`} fill={ORANGE} />
        <polygon points={`0,1720 ${W},1560 ${W},1920 0,1920`} fill={BLUE} />
        <polygon points={`0,1690 ${W},1530 ${W},1552 0,1712`} fill={ORANGE} />
      </svg>

      {/* 深藍斜切文字帶；色帶與文字共用同一個斜切容器，文字一定在色帶內 */}
      <div style={{position: 'absolute', left: -40, right: -40, top: 400, height: 360, transform: 'skewY(-6deg)'}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: BLUE,
            transformOrigin: 'left center',
            transform: `scaleX(${band})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 34,
            fontFamily: FONT,
            fontWeight: 900,
            lineHeight: 1,
            whiteSpace: 'nowrap',
            color: WHITE,
          }}
        >
          <div style={{fontSize: 100, opacity: t1, transform: `translateX(${(1 - t1) * -300}px) skewX(${SKEW}deg)`}}>
            上 <span style={{color: ORANGE}}>104</span> 搜尋：
          </div>
          <div style={{fontSize: 124, opacity: t2, transform: `translateX(${(1 - t2) * -300}px) skewX(${SKEW}deg)`}}>
            台灣格上租車
          </div>
        </div>
      </div>

      {/* QR Code（深藍點＋白底，外框橘色角標） */}
      <div
        style={{
          position: 'absolute',
          left: (W - QR_SIZE) / 2,
          top: QR_TOP,
          width: QR_SIZE,
          height: QR_SIZE,
          transform: `scale(${qr})`,
        }}
      >
        <QrCode value={QR_URL} size={QR_SIZE} color={BLUE} background={WHITE} />
        {[
          {left: -26, top: -26, borderLeft: 1, borderTop: 1},
          {right: -26, top: -26, borderRight: 1, borderTop: 1},
          {left: -26, bottom: -26, borderLeft: 1, borderBottom: 1},
          {right: -26, bottom: -26, borderRight: 1, borderBottom: 1},
        ].map(({borderLeft, borderTop, borderRight, borderBottom, ...pos}, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 90,
              height: 90,
              ...pos,
              borderLeft: borderLeft && `14px solid ${ORANGE}`,
              borderTop: borderTop && `14px solid ${ORANGE}`,
              borderRight: borderRight && `14px solid ${ORANGE}`,
              borderBottom: borderBottom && `14px solid ${ORANGE}`,
            }}
          />
        ))}
      </div>
      <Chevrons
        count={3}
        size={70}
        color={ORANGE}
        still
        style={{left: 70, top: QR_TOP + QR_SIZE / 2 - 35, opacity: deco}}
      />

      <AbsoluteFill style={{backgroundColor: WHITE, opacity: flash}} />
    </AbsoluteFill>
  );
};
