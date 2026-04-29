export function lowerBound<T>(arr: T[], pred: (v: T) => boolean) {
  let lo = 0
  let hi = arr.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (pred(arr[mid])) hi = mid
    else lo = mid + 1
  }
  return lo
}

export function upperBound<T>(arr: T[], pred: (v: T) => boolean) {
  let lo = 0
  let hi = arr.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (pred(arr[mid])) lo = mid + 1
    else hi = mid
  }
  return lo
}

