export function useTimelineZoom(zoomAt: (x: number, w: number, factor: number) => void) {
  // 中文注释：节流减少滚轮频率，保证高频缩放不抖动
  let lock = false;
  return (evt: WheelEvent, width: number) => {
    evt.preventDefault();
    if (lock) return;
    lock = true;
    requestAnimationFrame(() => {
      const factor = evt.deltaY > 0 ? 0.9 : 1.1;
      zoomAt(evt.offsetX, width, factor);
      lock = false;
    });
  };
}
