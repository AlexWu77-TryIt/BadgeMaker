// 原創節奏產生器：全部用數學合成（無取樣），輸出 public/beat.wav
// 180 BPM（每拍 10 格 @30fps），重拍對齊 src/theme.js 的分鏡時間
import {writeFileSync} from 'node:fs';

const SR = 44100;
const FPS = 30;
const DUR = 15;
const N = SR * DUR;
const L = new Float32Array(N);
const R = new Float32Array(N);

// 固定亂數種子，每次產生的檔案都一樣
let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const noiseBuf = Float32Array.from({length: SR * 2}, rnd);
const noise = (i) => noiseBuf[i % noiseBuf.length];

const f2s = (f) => Math.round((f / FPS) * SR); // 格數 → 取樣點
const add = (start, len, fn, gain = 1, pan = 0) => {
  const gl = gain * Math.min(1, 1 - pan);
  const gr = gain * Math.min(1, 1 + pan);
  for (let i = 0; i < len; i++) {
    const n = start + i;
    if (n < 0 || n >= N) continue;
    const v = fn(i / SR, i);
    L[n] += v * gl;
    R[n] += v * gr;
  }
};
const note = (m) => 440 * 2 ** ((m - 69) / 12);

// ── 樂器 ─────────────────────────────────────
const kick = (f, g = 1) => {
  let ph = 0;
  add(f2s(f), SR * 0.45, (t) => {
    const fr = 45 + 110 * Math.exp(-t * 28);
    ph += (2 * Math.PI * fr) / SR;
    return Math.sin(ph) * Math.exp(-t * 7) + (t < 0.004 ? noise(Math.floor(t * SR)) * 0.4 : 0);
  }, 0.9 * g);
};
const snare = (f, g = 1) => {
  let lp = 0;
  add(f2s(f), SR * 0.3, (t, i) => {
    const nz = noise(i + 7777);
    lp += 0.35 * (nz - lp);
    const hp = nz - lp;
    return hp * Math.exp(-t * 16) * 0.8 + Math.sin(2 * Math.PI * 185 * t) * Math.exp(-t * 25) * 0.5;
  }, 0.55 * g);
};
const hat = (f, g = 1, pan = 0.2) => {
  let lp = 0;
  add(f2s(f), SR * 0.06, (t, i) => {
    const nz = noise(i + 3333);
    lp += 0.6 * (nz - lp);
    return (nz - lp) * Math.exp(-t * 70);
  }, 0.22 * g, pan);
};
const bass = (f, lenFrames, m, g = 1) => {
  let lp = 0;
  const fr = note(m);
  add(f2s(f), f2s(lenFrames), (t) => {
    const saw = 2 * ((t * fr) % 1) - 1;
    const cutoff = 0.05 + 0.25 * Math.exp(-t * 10);
    lp += cutoff * (saw - lp);
    const env = Math.min(1, t * 200) * Math.exp(-t * 2.5);
    return (lp + Math.sin(2 * Math.PI * fr * t) * 0.6) * env;
  }, 0.32 * g);
};
const stab = (f, chord, g = 1, lenS = 0.22) => {
  chord.forEach((m, k) => {
    [-0.12, 0.12].forEach((det, j) => {
      const fr = note(m + det);
      let lp = 0;
      add(f2s(f), SR * lenS * 1.6, (t) => {
        const saw = 2 * ((t * fr) % 1) - 1;
        lp += (0.08 + 0.3 * Math.exp(-t * 14)) * (saw - lp);
        return lp * Math.min(1, t * 300) * Math.exp(-t / lenS * 2.2);
      }, 0.085 * g, j ? 0.5 : -0.5);
    });
  });
};
const whoosh = (f, lenFrames, g = 1, rising = true) => {
  let lp = 0;
  const len = f2s(lenFrames);
  add(f2s(f), len, (t, i) => {
    const p = i / len;
    const env = rising ? p ** 2 : Math.sin(Math.PI * p) ** 1.5;
    lp += (0.02 + 0.5 * p) * (noise(i + 999) - lp);
    return lp * env;
  }, 0.6 * g);
};
const riser = (f, lenFrames, g = 1) => {
  const len = f2s(lenFrames);
  let ph = 0;
  add(f2s(f), len, (t, i) => {
    const p = i / len;
    ph += (2 * Math.PI * (200 + 1400 * p * p)) / SR;
    return (Math.sin(ph) * 0.3 + noise(i + 5555) * 0.25 * p) * p * p;
  }, 0.5 * g);
};
const impact = (f, g = 1) => {
  kick(f, 1.2 * g);
  add(f2s(f), SR * 1.6, (t) => Math.sin(2 * Math.PI * 42 * t) * Math.exp(-t * 2.2), 0.6 * g);
  let lp = 0;
  add(f2s(f), SR * 1.4, (t, i) => {
    lp += 0.15 * (noise(i + 2222) - lp);
    return lp * Math.exp(-t * 3.5);
  }, 0.9 * g);
};
const tick = (f, m, g = 1) =>
  add(f2s(f), SR * 0.05, (t) => Math.sin(2 * Math.PI * note(m) * t) * Math.exp(-t * 90), 0.18 * g, 0.3);
const pop = (f, g = 1) => {
  let ph = 0;
  add(f2s(f), SR * 0.12, (t) => {
    ph += (2 * Math.PI * (300 + 900 * Math.exp(-t * 40))) / SR;
    return Math.sin(ph) * Math.exp(-t * 30);
  }, 0.35 * g);
};

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

// ── 簡易殘響＋混音 ─────────────────────────
const out = new Int16Array(N * 2);
const taps = [[0.029, 0.28], [0.041, 0.22], [0.067, 0.16], [0.089, 0.12]].map(([s, g]) => [Math.round(s * SR), g]);
const wet = (buf, i) => taps.reduce((acc, [d, g]) => acc + (i >= d ? buf[i - d] * g : 0), 0);
let peak = 0;
const mixL = new Float32Array(N), mixR = new Float32Array(N);
for (let i = 0; i < N; i++) {
  mixL[i] = L[i] + wet(R, i) * 0.6;
  mixR[i] = R[i] + wet(L, i) * 0.6;
  peak = Math.max(peak, Math.abs(mixL[i]), Math.abs(mixR[i]));
}
const norm = 2.6 / peak; // 推高響度，tanh 柔性限幅避免爆音
const fadeStart = N - SR * 0.6;
for (let i = 0; i < N; i++) {
  const fade = i > fadeStart ? 1 - (i - fadeStart) / (N - fadeStart) : 1;
  out[i * 2] = Math.tanh(mixL[i] * norm) * 0.89 * fade * 32767;
  out[i * 2 + 1] = Math.tanh(mixR[i] * norm) * 0.89 * fade * 32767;
}

// ── 寫 WAV ─────────────────────────────────
const header = Buffer.alloc(44);
header.write('RIFF', 0); header.writeUInt32LE(36 + out.byteLength, 4); header.write('WAVE', 8);
header.write('fmt ', 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24); header.writeUInt32LE(SR * 4, 28); header.writeUInt16LE(4, 32); header.writeUInt16LE(16, 34);
header.write('data', 36); header.writeUInt32LE(out.byteLength, 40);
const file = new URL('../public/beat.wav', import.meta.url);
writeFileSync(file, Buffer.concat([header, Buffer.from(out.buffer)]));
console.log('寫入', file.pathname, (out.byteLength / 1e6).toFixed(1) + ' MB');
