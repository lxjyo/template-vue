import { computed, shallowRef, watch, toRefs, shallowReactive } from 'vue';
import axios from '@common/js/utils/axios';

/**
 * 使用分页查询的 Composition API 函数。
 * 根据提供的选项设置，初始化查询状态，并提供查询、分页及搜索功能。
 *
 * @param {Object|string} options - 查询配置对象或请求URL字符串。
 * @param {string} [options.url] - 请求的URL。
 * @param {'post'|'get'} [options.type='post'] - 请求方法，默认为'post'。
 * @param {boolean} [options.immediate=true] - 是否立即执行首次查询。
 * @param {Object} [options.filters={}] - 初始查询参数。
 * @param {Function} [options.formatter] - 格式化返回值方法。
 *
 * @returns {Object} 返回包含查询结果、分页信息及搜索方法的对象。
 * @property {Object} result - 查询结果状态对象，包含total、current、pageSize、list和loading属性。
 * @property {Object} pagination - 分页配置对象，用于UI展示。
 * @property {Function} onSearch - 搜索方法，接收查询参数对象并更新查询条件。
 */
function useQueryByPage(options) {
  const formatOptions = typeof options === 'string' ? { url: options } : options;
  const { url, type = 'post', immediate = true, filters = {}, formatter } = formatOptions;
  const pageSize = filters.pageSize || 20;
  // 结果数据
  const result = shallowReactive({
    total: 0,
    current: 1,
    pageSize,
    list: [],
    loading: false
  });
  // 查询参数
  const queryParams = shallowRef({
    ...filters,
    current: 1,
    pageSize
  });

  // 查询方法
  const query = async () => {
    result.loading = true;
    const { current, ...restParams } = queryParams.value;
    const { flag, data } = await axios[type](url, {
      ...restParams,
      curPage: current - 1
    });
    if (flag === 1) {
      Object.assign(result, {
        current,
        pageSize: restParams.pageSize,
        list: formatter ? formatter(data.list) : data.list,
        total: data.total,
        loading: false
      });
    } else {
      result.loading = false;
    }
  };

  // 查询条件改变时，重新查询
  watch(queryParams, query, {
    immediate
  });

  // 分页
  const pagination = computed(() => ({
    current: result.current,
    pageSize: result.pageSize,
    total: result.total,
    showTotal: total => `共 ${total} 条`,
    showSizeChanger: false,
    showQuickJumper: true
  }));

  // 查询
  const onSearch = (newFilters = {}) => {
    queryParams.value = {
      ...queryParams.value,
      ...newFilters
    };
  };

  return {
    ...toRefs(result),
    pagination,
    onSearch
  };
}

export default useQueryByPage;
