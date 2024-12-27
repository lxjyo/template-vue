import { message, notification } from 'ant-design-vue';
import axios from 'axios';
import { isObject } from './utils.js';

const ajax = axios.create({
  timeout: 60 * 1000,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  transformRequest: [
    data => {
      if (isObject(data)) {
        return Object.keys(data)
          .reduce((result, val) => {
            if (data[val] !== null && data[val] !== undefined) {
              result += `${encodeURIComponent(val)}=${encodeURIComponent(data[val])}&`;
            }
            return result;
          }, '')
          .replace(/&$/, '');
      } else {
        return data;
      }
    }
  ]
});

let cloneGet = ajax.get;
ajax.get = (url, data, config) => {
  return cloneGet(url, { params: data, ...config });
};

ajax.interceptors.response.use(
  response => {
    const { flag, msg = flag === 1 ? '操作成功' : '' } = response.data;
    // useDefaultErrorHandler: 是否使用默认的错误处理
    // useDefaultRes: 是否使用默认的response
    const { useDefaultErrorHandler = true, useDefaultRes = false } = response.config;
    // 做事情
    if (flag === 0 && useDefaultErrorHandler) {
      notification.error({
        message: '错误信息',
        description: msg
      });
    }
    return useDefaultRes ? response : response.data;
  },
  error => {
    // 这里可以做事情
    message.error(`接口请求失败: ${error}`);
    return Promise.reject(error);
  }
);

export default ajax;
