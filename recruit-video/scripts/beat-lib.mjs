// 原創節奏共用樂器：全部用數學合成（無取樣）。各支影片的編曲見 make-beat*.mjs
// 180 BPM（每拍 10 格 @30fps）
import {writeFileSync} from 'node:fs';

const SR = 44100;
const FPS = 30;
const DUR = 15;
const N = SR * DUR;
export const L = new Float32Array(N);
export const R = new Float32Array(N);

// 固定亂數種子，每次產生的檔案都一樣
let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const noiseBuf = Float32Array.from({length: SR * 2}, rnd);
const noise = (i) => noiseBuf[i % noiseBuf.length];

export const f2s = (f) => Math.round((f / FPS) * SR); // 格數 → 取樣點
export const add = (start, len, fn, gain = 1, pan = 0) => {
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
export const note = (m) => 440 * 2 ** ((m - 69) / 12);

// ── 樂器 ─────────────────────────────────────
export const kick = (f, g = 1) => {
  let ph = 0;
  add(f2s(f), SR * 0.45, (t) => {
    const fr = 45 + 110 * Math.exp(-t * 28);
    ph += (2 * Math.PI * fr) / SR;
    return Math.sin(ph) * Math.exp(-t * 7) + (t < 0.004 ? noise(Math.floor(t * SR)) * 0.4 : 0);
  }, 0.9 * g);
};
export const snare = (f, g = 1) => {
  let lp = 0;
  add(f2s(f), SR * 0.3, (t, i) => {
    const nz = noise(i + 7777);
    lp += 0.35 * (nz - lp);
    const hp = nz - lp;
    return hp * Math.exp(-t * 16) * 0.8 + Math.sin(2 * Math.PI * 185 * t) * Math.exp(-t * 25) * 0.5;
  }, 0.55 * g);
};
export const hat = (f, g = 1, pan = 0.2) => {
  let lp = 0;
  add(f2s(f), SR * 0.06, (t, i) => {
    const nz = noise(i + 3333);
    lp += 0.6 * (nz - lp);
    return (nz - lp) * Math.exp(-t * 70);
  }, 0.22 * g, pan);
};
export const bass = (f, lenFrames, m, g = 1) => {
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
export const stab = (f, chord, g = 1, lenS = 0.22) => {
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
export const whoosh = (f, lenFrames, g = 1, rising = true) => {
  let lp = 0;
  const len = f2s(lenFrames);
  add(f2s(f), len, (t, i) => {
    const p = i / len;
    const env = rising ? p ** 2 : Math.sin(Math.PI * p) ** 1.5;
    lp += (0.02 + 0.5 * p) * (noise(i + 999) - lp);
    return lp * env;
  }, 0.6 * g);
};
export const riser = (f, lenFrames, g = 1) => {
  const len = f2s(lenFrames);
  let ph = 0;
  add(f2s(f), len, (t, i) => {
    const p = i / len;
    ph += (2 * Math.PI * (200 + 1400 * p * p)) / SR;
    return (Math.sin(ph) * 0.3 + noise(i + 5555) * 0.25 * p) * p * p;
  }, 0.5 * g);
};
export const impact = (f, g = 1) => {
  kick(f, 1.2 * g);
  add(f2s(f), SR * 1.6, (t) => Math.sin(2 * Math.PI * 42 * t) * Math.exp(-t * 2.2), 0.6 * g);
  let lp = 0;
  add(f2s(f), SR * 1.4, (t, i) => {
    lp += 0.15 * (noise(i + 2222) - lp);
    return lp * Math.exp(-t * 3.5);
  }, 0.9 * g);
};
export const tick = (f, m, g = 1) =>
  add(f2s(f), SR * 0.05, (t) => Math.sin(2 * Math.PI * note(m) * t) * Math.exp(-t * 90), 0.18 * g, 0.3);
export const pop = (f, g = 1) => {
  let ph = 0;
  add(f2s(f), SR * 0.12, (t) => {
    ph += (2 * Math.PI * (300 + 900 * Math.exp(-t * 40))) / SR;
    return Math.sin(ph) * Math.exp(-t * 30);
  }, 0.35 * g);
};

// ── 簡易殘響＋混音，寫出 WAV ──────────────────
export const writeBeat = (filename) => {
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
  const file = new URL(`../public/${filename}`, import.meta.url);
  writeFileSync(file, Buffer.concat([header, Buffer.from(out.buffer)]));
  console.log('寫入', file.pathname, (out.byteLength / 1e6).toFixed(1) + ' MB');
};
