import { Form } from 'ant-design-vue';
import { ref, createVNode } from 'vue';
import showModal from './modal';

function showModalForm(Content, formProps, modalProps) {
  const formRef = ref();
  showModal(
    createVNode(
      Form,
      {
        ...formProps,
        formRef
      },
      () => Content
    ),
    {},
    {
      ...modalProps,
      onOk: async () => {
        await formRef.value.validate();
        Promise.resolve(formProps.onOk()).then(() => {
          formRef.value.resetFields();
        });
      },
      onCancel: () => {
        formRef.value.resetFields();
      }
    }
  );
}

export default showModalForm;
