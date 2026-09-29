export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const BLUE = '#003478';
export const WHITE = '#FFFFFF';
export const ORANGE = '#F05A28';

export const FONT = '"Noto Sans TC", sans-serif';
export const SKEW = -10; // 大字斜切角度（度）

// IG Reels 安全範圍：上方與下方會被介面蓋住
export const SAFE_TOP = 250;
export const SAFE_BOTTOM = H - 380;

// 分鏡時間（格數，30fps）— 之後對齊音樂節拍只要改這裡
export const T = {
  opening: 0, // 0–2 秒
  words: 60, // 2–6 秒
  wordLen: 39, // 每個字約 1.3 秒
  info: 180, // 6–11 秒
  sprint: 330, // 11–13 秒
  end: 390, // 13–15 秒
  total: 450,
};

// 影片中出現的全部文字（用來預先載入字型，確保不缺字）
export const ALL_TEXT =
  '你的第一站，想去哪？成長挑戰轉型60+職缺旅遊補助每年最高30,000元多元社團活動加入格上上104搜尋：台灣格上租車0123456789';
