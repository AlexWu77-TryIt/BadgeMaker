# 格上租車 新鮮人招募短片（Remotion）

- 規格：1080×1920 直式、30fps、15 秒（450 格），發布平台 IG Reels
- 字體：Noto Sans TC Black（`@fontsource/noto-sans-tc`，已打包在專案內，渲染時不連外）
- 分鏡時間集中在 `src/theme.js` 的 `T`，之後對齊音樂節拍只要改這裡

## 指令
```bash
npm install
npm run studio         # 開啟預覽介面
npm run render:sample  # 0–5 秒樣片 → out/sample-0-5s.mp4
npm run render         # 完整 15 秒 → out/carplus-recruit-15s.mp4
npm run beat           # 重新產生原創節奏 → public/beat.wav
```
無法自動下載 Chrome 的環境，先設定 `REMOTION_BROWSER=<瀏覽器路徑>`。

## 音樂
`public/beat.wav` 是 `scripts/make-beat.mjs` 用數學合成的原創節奏（無取樣、無版權疑慮），180 BPM、每拍 10 格，
重拍對齊：2 秒（成長）、3.33 秒（挑戰）、4.67 秒（轉型）、6 秒（資訊）、11 秒（衝刺）、12 秒（加入格上）、13 秒（結尾）。
之後換成授權音樂：把音檔放進 `public/`，改 `src/Video.jsx` 的檔名，再依節拍調整 `src/theme.js` 的 `T`。

## 進度
- [x] 0–2 秒 開場（光軌＋「你的第一站，想去哪？」）
- [x] 2–6 秒 三大字（成長／挑戰／轉型，各 40 格）
- [x] 6–11 秒 三組資訊（60+ 職缺／旅遊補助 每年最高 30,000 元／多元社團活動）
- [x] 11–13 秒 衝刺＋「加入格上」
- [x] 13–15 秒 結尾（上 104 搜尋：台灣格上租車＋QR Code；Logo 暫不放）
- [x] 原創節奏（暫用）
- [ ] Logo（待提供）

---

# 第二支：2026 五心相IN運動會（Composition：`SportsDay`）

- 素材（照片、影片、Logo）放在 `public/event/`，**已設定不上傳 GitHub**；換電腦時需重新放入
- 分鏡時間在 `src/sportsday/timing.js`；原創節奏 `npm run beat:sportsday` → `public/beat-sportsday.wav`
- 照片只用裁切遮罩做出斜邊，不做任何變形；Google Cloud 標誌已模糊、暖身照右側講師已裁掉

```bash
npx remotion render src/index.jsx SportsDay out/sportsday-sample-0-5s.mp4 --frames=0-149
```

- [x] 0–5 秒樣片（標題、超過 150 人參加、一起動起來）
- [ ] 5–15 秒（等樣片確認）
