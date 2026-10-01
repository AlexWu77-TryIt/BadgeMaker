// 第一支（新鮮人招募）的原創節奏編曲，輸出 public/beat.wav
// 重拍對齊 src/theme.js 的分鏡時間
import {bass, hat, impact, kick, pop, riser, snare, stab, tick, whoosh, writeBeat} from './beat-lib.mjs';

// ── 編曲（單位：格，30fps；每拍 10 格，每小節 40 格）─────────
const E = 40, C = 36, D = 38, G = 43;
const CH = {Em: [64, 67, 71], C: [60, 64, 67], D: [62, 66, 69], G: [59, 62, 67]};

// 0–60 前奏：光軌 whoosh、低音脈動、riser 疊上去
whoosh(2, 16, 1.1, false);
riser(10, 50, 0.9);
for (let f = 0; f < 60; f += 5) bass(f, 5, E, 0.35 + (f / 60) * 0.4);
for (let f = 20; f < 60; f += 10) hat(f, 0.6);
kick(12, 0.5);
kick(19, 0.5);
whoosh(52, 8, 0.8);

// 標準律動：一小節（40 格）
const groove = (b, root, chord, g = 1) => {
  kick(b, g); kick(b + 25, 0.8 * g);
  snare(b + 20, g);
  for (let s = 0; s < 40; s += 5) hat(b + s, s % 10 ? 1 : 0.55, s % 10 ? 0.25 : -0.25);
  bass(b, 10, root, g); bass(b + 15, 5, root + 12, 0.7 * g); bass(b + 25, 15, root, g);
  if (chord) { stab(b + 5, CH[chord], g); stab(b + 15, CH[chord], 0.8 * g); stab(b + 35, CH[chord], 0.7 * g); }
};

// 60–180 三大字：每個字一小節，進場重拍
impact(60, 1);
groove(60, E, null);
whoosh(96, 5, 0.6); impact(100, 0.5); groove(100, C, null);
whoosh(136, 5, 0.6); impact(140, 0.5); groove(140, D, null);

// 180–330 三組資訊：加入和弦
whoosh(176, 5, 0.6);
groove(180, E, 'Em');
groove(220, C, 'C');
groove(260, G, 'G');
groove(300, D, 'D', 0.9); // 300–330 只用前 30 格
[184, 224, 264].forEach((f) => pop(f));
for (let f = 188; f <= 210; f += 2) tick(f, 76 + (f - 188) / 2);
for (let f = 228; f <= 254; f += 2) tick(f, 76 + (f - 228) / 2);

// 330–360 衝刺：鼓點加速＋riser，360 前留一瞬間空白
riser(326, 32, 1.2);
whoosh(330, 28, 1);
for (let f = 330; f < 358;) {
  snare(f, 0.35 + ((f - 330) / 28) * 0.6);
  f += f < 342 ? 5 : f < 352 ? 2.5 : 1.25;
}
for (let f = 330; f < 356; f += 5) bass(f, 5, D, 0.6);

// 360 加入格上：大重拍
impact(360, 1.3);
stab(360, [...CH.Em, 76], 1.3, 0.5);
groove(360, E, 'Em', 1.05); // 360–390

// 390 結尾：定格重拍＋和弦長音
impact(390, 1.1);
stab(390, [52, ...CH.Em, 76], 1.8, 2.2);
bass(390, 60, E, 0.9);

writeBeat('beat.wav');
