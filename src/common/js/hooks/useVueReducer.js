import { ref, readonly } from 'vue';
import { isFunction, isObject } from './utils/types';

/**
 * vue版本的reducer hooks
 * 使用给定的reducer函数和初始状态管理状态
 * @param {Function} reducer - 用于更新state的函数，参数为当前state和action,函数应为纯函数
 * @param {object|Function} initialState - 初始状态，可以是任意类型或一个返回初始状态的函数
 * @returns {Array} - 一个数组，包含当前状态的只读引用和一个用于触发状态更新的函数
 */
function useReducer(reducer, initialState) {
  if (!isFunction(reducer)) {
    throw new Error('reducer must be a function');
  }
  if (!isFunction(initialState) && !isObject(initialState)) {
    throw new Error('initialState must be a function or object');
  }

  const state = ref(isFunction(initialState) ? initialState() : initialState);
  const dispatch = action => {
    state.value = reducer(state.value, action);
  };

  return [readonly(state), dispatch];
}

export default useReducer;
