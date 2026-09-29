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
```
無法自動下載 Chrome 的環境，先設定 `REMOTION_BROWSER=<瀏覽器路徑>`。

## 進度
- [x] 0–2 秒 開場（光軌＋「你的第一站，想去哪？」）
- [x] 2–6 秒 三大字（成長／挑戰／轉型）
- [ ] 6–11 秒 三組資訊（等樣片確認）
- [ ] 11–13 秒 衝刺＋「加入格上」
- [ ] 13–15 秒 結尾（104 搜尋＋QR Code；Logo 暫不放）
- [ ] 音樂（待提供有授權的音檔）
