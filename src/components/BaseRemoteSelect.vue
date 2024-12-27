<script setup>
import { ref, toRefs, watch, useAttrs } from 'vue';
import { debounce, isEqualObject, isObject } from '@common/js/utils';
import ajax from '@common/js/axios.js';

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  params: {
    type: Object,
    default: () => ({})
  },
  // 请求校验
  fetchValidator: {
    type: Function,
    default: () => () => true
  },
  // 远程搜索
  remoteSearch: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'keyword'
  },
  type: {
    default: 'get',
    validator(value) {
      return ['get', 'post'].includes(value);
    }
  },
  formatter: {
    type: Function,
    default: v => {
      if (!isObject(v[0])) {
        return v.map(w => ({ label: w, value: w }));
      } else {
        return v;
      }
    }
  }
});
const emit = defineEmits(['initial']);
const { params, url, remoteSearch } = toRefs(props);
const loading = ref(false);
const list = ref([]);
const attrs = useAttrs();
//  清理列表
const clearOptions = () => {
  list.value = [];
};

defineExpose({
  clearOptions
});

// 筛选
const filterOption = (input, option) => {
  const fieldNames = attrs.fieldNames;
  const label = fieldNames?.label || 'label';
  return option[label].toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// 查询
const fetchList = async keyword => {
  if (remoteSearch.value && !keyword) return;
  try {
    const queryParams = {
      ...params.value
    };
    if (remoteSearch.value) {
      queryParams[props.name] = keyword;
    }
    if (!props.fetchValidator(queryParams)) {
      return;
    }
    list.value = [];
    loading.value = true;
    const { flag, data } = await ajax[props.type](url.value, queryParams);
    if (flag === 1) {
      list.value = props.formatter(data);
      !remoteSearch.value && emit('initial', data);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
};
// debounce
const debouncedFetchList = debounce(fetchList, 300);

// 仅针对非远程搜索
// 仅在 remoteSearch 为 false 时监听params 的变化
if (!remoteSearch.value) {
  watch(
    [params, url],
    ([values, newUrl], [oldValues, oldUrl]) => {
      if (!isEqualObject(values, oldValues) || newUrl !== oldUrl) {
        fetchList();
      }
    },
    { immediate: true } // 在初始加载时立即执行一次
  );
}
</script>

<template>
  <a-select
    v-if="remoteSearch"
    show-search
    allow-clear
    :filter-option="false"
    :options="list"
    :not-found-content="loading ? undefined : null"
    @search="debouncedFetchList"
  />
  <a-select v-else show-search allow-clear :options="list" :filterOption="filterOption" />
</template>
