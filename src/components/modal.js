import { Modal } from 'ant-design-vue';
import { createVNode, render as vueRender } from 'vue';

/**
 * 命令式方式显示Modal
 * @param {VNode} Content 
 * @param {Object|null} contentProps 
 * @param {Object} modalProps 
 * @returns 
 */
function showModal(Content, contentProps, modalProps = {}) {
  const container = document.createElement('div');
   // 创建需要渲染的内容节点
   const _contentVnode = createVNode(Content, contentProps);

  // Modal组件的props
  const metadata = Object.create({
    okText: '确定',
    cancelText: '取消',
    open: true,
    ...modalProps
  });
  // 取消
  metadata.onCancel = async function (e) {
    if (modalProps.onCancel) {
      await modalProps.onCancel(e);
    }
    close();
  };
  // 点击确认
  metadata.onOk = async function (e) {
    if (!(modalProps.onOk instanceof Function)) {
      close();
      return;
    }
    const result = modalProps?.onOk(e);
    if (!(result instanceof Promise)) {
      close();
      return;
    }
    update({ confirmLoading: true });
    return result
      .then(() => {
        update({ confirmLoading: false });
        close();
      })
      .catch(() => {
        update({ confirmLoading: false });
      });
  };

  const vm = createVNode(Modal, metadata, () => _contentVnode);

  // 更新
  function update(config) {
    if (vm?.component) {
      Object.assign(vm.component.props, config);
      // update: Force update render effect
      vm.component.update();
    }
  }

   // 关闭
   function close() {
    metadata.open = false;
    update(metadata);
  }


  // 销毁
  function destroy() {
    if (vm) {
      vueRender(null, container);
      vm = null;
    }
  }

  // 渲染到容器里
  vueRender(vm, container);

  return {
    ..._contentVnode,
    close,
    destroy,
    update,
  };
}

export default showModal;