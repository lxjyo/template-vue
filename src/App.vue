<script setup>
import { RouterView } from 'vue-router';
import BaseLayout from '@/components/BaseLayout.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'ant-design-vue/locale/zh_CN';
dayjs.locale('zh-cn');
import { RouterLink } from 'vue-router';
import { h, ref } from 'vue';
import { FolderOpenOutlined, MoneyCollectOutlined } from '@ant-design/icons-vue';

function getItem({ label, path, key, icon, children, type }) {
  return {
    key: path ? path.split('/').slice(1).join('-') : key,
    icon: icon ? () => h(icon) : null,
    children,
    label: path
      ? h(
          RouterLink,
          {
            to: path
          },
          () => label
        )
      : label,
    type
  };
}

const menus = [
  getItem({
    label: 'Home',
    path: '/home',
    icon: MoneyCollectOutlined
  }),
  getItem({
    label: 'About',
    path: '/about',
    icon: FolderOpenOutlined
  })
];

const selectedKeys = ref(['home']);

// 退出
const onClickDropdownMenu = () => {};
</script>

<template>
  <a-config-provider :locale="locale">
    <BaseLayout :backTop="false" :menus="menus" v-model:selectedKeys="selectedKeys">
      <template #header>
        <a-dropdown>
          <a-space class="pointer">
            <user-outlined />
            <span>你好，xxx</span>
          </a-space>
          <template #overlay>
            <a-menu @click="onClickDropdownMenu">
              <a-menu-item key="logout">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <RouterView />
    </BaseLayout>
  </a-config-provider>
</template>
