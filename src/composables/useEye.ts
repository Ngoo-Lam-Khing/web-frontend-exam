import { useMouse } from 'react-use';
import { useRef, type RefObject, useMemo } from 'react';

type Range = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

const SENSITIVITY = 180; // 稍微放大距離，讓移動更柔和

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// 非線性 easing（讓中心比較穩，邊緣才快）
function easeOutQuad(t: number) {
  return t * (2 - t);
}

export function useEyeOffset(eyeRef: RefObject<HTMLElement | null>, range: Range) {
  const ref = useRef(document.documentElement);
  const { docX, docY } = useMouse(ref);

  return useMemo(() => {
    if (!eyeRef.current) return { x: 0, y: 0 };

    const rect = eyeRef.current.getBoundingClientRect();

    const eyeCenterX = rect.left + window.scrollX + rect.width / 2;
    const eyeCenterY = rect.top + window.scrollY + rect.height / 2;

    const deltaX = docX - eyeCenterX;
    const deltaY = docY - eyeCenterY;

    // normalize 到 -1 ~ 1
    const nx = clamp(deltaX / SENSITIVITY, -1, 1);
    const ny = clamp(deltaY / SENSITIVITY, -1, 1);

    // 套 easing（讓中心更自然）
    const ex = easeOutQuad(Math.abs(nx)) * Math.sign(nx);
    const ey = easeOutQuad(Math.abs(ny)) * Math.sign(ny);

    // mapping 到各自範圍
    const x = ex > 0 ? ex * range.xMax : ex * Math.abs(range.xMin);

    const y = ey > 0 ? ey * range.yMax : ey * Math.abs(range.yMin);

    return { x, y };
  }, [docX, docY, eyeRef, range.xMax, range.xMin, range.yMax, range.yMin]);
}
