export function debounce (func, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      func.apply(this, args)
      // 一定要清空，便于之后判断
      timer = null
    }, delay)
  }
}
