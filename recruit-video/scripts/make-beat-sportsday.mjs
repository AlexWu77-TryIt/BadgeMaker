// 第二支（五心相IN運動會）的原創節奏編曲，輸出 public/beat-sportsday.wav
// 重拍對齊 src/sportsday/timing.js 的分鏡時間（單位：格，30fps；每拍 10 格）
import {bass, hat, impact, kick, pop, riser, snare, stab, tick, whoosh, writeBeat} from './beat-lib.mjs';

const E = 40, C = 36, D = 38, G = 43, A = 45;
const CH = {Em: [64, 67, 71], C: [60, 64, 67], D: [62, 66, 69], G: [59, 62, 67], Am: [57, 60, 64]};

const groove = (b, len, root, chord, g = 1) => {
  for (let s = 0; s < len; s += 40) {
    const t = b + s;
    kick(t, g);
    if (s + 25 < len) kick(t + 25, 0.8 * g);
    if (s + 20 < len) snare(t + 20, g);
    for (let h = 0; h < Math.min(40, len - s); h += 5) hat(t + h, h % 10 ? 1 : 0.55, h % 10 ? 0.25 : -0.25);
    bass(t, 10, root, g);
    if (s + 15 < len) bass(t + 15, 5, root + 12, 0.7 * g);
    if (s + 25 < len) bass(t + 25, Math.min(15, len - s - 25), root, g);
    if (chord) {
      stab(t + 5, CH[chord], g);
      if (s + 15 < len) stab(t + 15, CH[chord], 0.8 * g);
      if (s + 35 < len) stab(t + 35, CH[chord], 0.7 * g);
    }
  }
};

// 0–50 標題：光軌 whoosh＋riser，文字砸入的重音
whoosh(2, 16, 1.1, false);
riser(4, 46, 0.8);
for (let f = 0; f < 50; f += 5) bass(f, 5, E, 0.35 + (f / 50) * 0.4);
for (let f = 20; f < 50; f += 10) hat(f, 0.6);
kick(10, 0.6);
kick(20, 0.6);
kick(30, 0.6);
whoosh(44, 6, 0.8);

// 50–110 超過 150 人參加：大重拍＋計數滴答
impact(50, 1);
groove(50, 60, E, null);
for (let f = 58; f <= 90; f += 2) tick(f, 72 + (f - 58) / 2);
pop(92);

// 110–190 一起動起來（熱舞照 → 躲避球）
whoosh(106, 4, 0.6);
impact(110, 0.6);
groove(110, 80, C, 'C');
whoosh(146, 4, 0.5);

// 190–270 同心協力（毛毛蟲 → 大球）
whoosh(186, 4, 0.6);
impact(190, 0.6);
groove(190, 80, G, 'G');
whoosh(226, 4, 0.5);

// 270–320 全力以赴：鼓點加密往五心推
whoosh(266, 4, 0.6);
impact(270, 0.6);
groove(270, 30, D, 'D');
riser(296, 24, 0.9);
for (let f = 300; f < 320; f += 2.5) snare(f, 0.35 + ((f - 300) / 20) * 0.5);

// 320–370 五心：每一拍一個心，和弦一路往上爬
const hearts = [[52, 64, 67, 71], [55, 67, 71, 74], [57, 69, 72, 76], [59, 71, 74, 78], [64, 76, 79, 83]];
hearts.forEach((ch, i) => {
  const f = 320 + i * 10;
  kick(f, 0.9);
  stab(f, ch, 1.1, 0.18);
  hat(f + 5, 1);
  bass(f, 10, E + (i === 4 ? 12 : 0), 0.8);
});

// 370–400 心動不如馬上行動：大重拍，衝進結尾
impact(370, 1.2);
stab(370, [...CH.Em, 76], 1.2, 0.4);
groove(370, 30, E, 'Em', 1.05);
whoosh(392, 8, 0.8);

// 400–450 結尾定格
impact(400, 1.1);
stab(400, [52, ...CH.Em, 76], 1.8, 2.2);
bass(400, 50, E, 0.9);

writeBeat('beat-sportsday.wav');
