import { ref } from 'vue';
import { isObject } from '@common/js/utils/types';
import download from '@common/js/utils/download';
import axios from '@common/js/axios';

// 导出
const useExport = url => {
  const exporting = ref(false);
  const onExport = async (values = {}) => {
    if (!isObject(values)) {
      throw new TypeError('param should be an object');
    }
    exporting.value = true;
    const response = await axios.get(
      url,
      {
        ...values,
        responseType: 'blob'
      },
      {
        useDefaultRes: true
      }
    );
    const contentDisposition = response.headers['content-disposition'];
    const filename = decodeURIComponent(contentDisposition.split('filename=')[1]);
    const blobUrl = new Blob([response.data], {
      type: 'application/octet-stream'
    });
    download(blobUrl, filename);
    exporting.value = false;
  };

  return [exporting, onExport];
};

export default useExport;
