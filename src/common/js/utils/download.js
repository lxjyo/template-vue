/**
 * 下载
 * @param {*} blob
 * @param {*} filename
 */
export default function download(blob, filename) {
  if (typeof window.navigator.msSaveBlog !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlog(blob, decodeURI(filename));
  } else {
    // 创建新的url并指向file对象或者 blob对象的地址
    const blobUrl = window.URL.createObjectURL(blob);
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a');
    tempLink.href = blobUrl;
    tempLink.setAttribute('download', filename);
    // 兼容不支持html5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    tempLink.style.display = 'none';
    // 挂载a标签
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    // 释放blob url地址
    window.URL.revokeObjectURL(blobUrl);
  }
}
