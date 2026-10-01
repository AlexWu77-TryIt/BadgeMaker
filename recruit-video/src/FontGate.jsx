import {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import '@fontsource/noto-sans-tc/900.css';
import {ALL_TEXT} from './theme';

// 等超粗黑體的所有字元載入完成才開始畫，避免缺字或用到替代字型
export const FontGate = ({children, text = ALL_TEXT}) => {
  const [handle] = useState(() => delayRender('載入 Noto Sans TC Black'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    document.fonts
      .load('900 100px "Noto Sans TC"', text)
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle, text]);
  return ready ? children : null;
};
