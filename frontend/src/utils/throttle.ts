export const throttle = <T extends (...args: any[]) => void>(fn: T, wait = 16) => {
  let prev = 0
  return (...args: Parameters<T>) => {
    const now = performance.now()
    if (now - prev > wait) { prev = now; fn(...args) }
  }
}
