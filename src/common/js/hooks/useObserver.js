import debounce from './utils/debounce';
import ResizeObserver from 'resize-observer-polyfill';
import { shallowRef, onMounted, onBeforeUnmount } from 'vue';

/**
 * 观察元素大小变化
 * @param {HTMLElement} dom
 * @param {function} callback
 */
function useObserver(dom, callback) {
  let observer = null;
  const target = shallowRef(dom);

  onMounted(() => {
    if (target.value) {
      observer = new ResizeObserver(debounce(callback, 50));
      observer.observe(target.value);
    }
  });

  // 解绑
  const unobserve = () => {
    observer && observer.unobserve(target.value);
  };

  onBeforeUnmount(unobserve);

  return unobserve;
}

export default useObserver;
