/**
 * 函数柯里化
 * @param {function} fn
 */
export default function curry(fn) {
  // 检查传入的参数是否为函数，增加健壮性
  if (typeof fn !== 'function') {
    throw new TypeError('Expected the first argument to be a function');
  }

  return function curried(...args) {
    // 函数上下文的处理，此处保持原样，但在文档中说明或考虑其他方案
    if (args.length >= fn.length) {
      // 当参数足够时，调用原始函数
      return fn.apply(this, args);
    } else {
      // 返回一个新的函数来继续接受参数
      return function (...args2) {
        // 使用concat来合并参数列表，避免修改原args数组
        // 使用bind来确保this的一致性，此处this指curried函数的this
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}
