import QRCode from 'qrcode';
import {useMemo} from 'react';

// QR Code：用 qrcode 套件產生點陣，再畫成 SVG（不用外部服務）
export const QrCode = ({value, size, color = '#000', background = '#fff', margin = 4}) => {
  const {cells, n} = useMemo(() => {
    const qr = QRCode.create(value, {errorCorrectionLevel: 'M'});
    const n = qr.modules.size;
    const cells = [];
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (qr.modules.get(y, x)) cells.push(`M${x + margin},${y + margin}h1v1h-1z`);
      }
    }
    return {cells: cells.join(''), n};
  }, [value, margin]);
  const total = n + margin * 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} shapeRendering="crispEdges">
      <rect width={total} height={total} fill={background} />
      <path d={cells} fill={color} />
    </svg>
  );
};
