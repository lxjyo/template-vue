<script>
import iconUrl from '@common/imgs/logo.svg?url'
export default {
  name: 'BaseLayout',
  inheritAttrs: false,
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    openKeys: {
      type: Array,
      default: () => []
    },
    selectedKeys: {
      type: Array,
      default: () => []
    },
    headerHeight: {
      type: String,
      default: '48px'
    },
    backTop: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:selectedKeys'],
  data() {
    return {
      iconUrl,
      collapsed: false
    };
  },
  methods: {
    target() {
      return document.querySelector('#layout-content');
    },
    onSelect({ item, key, selectedKeys }) {
      this.$emit('update:selectedKeys', selectedKeys);
    }
  }
};
</script>
<template>
  <a-layout class="page-layout-container">
    <a-layout-header id="header">
      <a href="" class="logo-box">
        <img :src="iconUrl" />
      </a>
      <div class="nav-right">
        <a-space :size="16">
          <slot name="header"></slot>
        </a-space>
      </div>
    </a-layout-header>
    <a-layout hasSider id="sider-content-layout">
      <a-layout-sider
        breakpoint="lg"
        theme="light"
        collapsible
        v-model:collapsed="collapsed"
        :collapsed-width="80"
        id="sider"
        v-if="menus.length > 0"
      >
        <a-menu
          :openKeys="collapsed ? [] : openKeys"
          :selectedKeys="selectedKeys"
          @select="onSelect"
          :items="menus"
          theme="light"
          mode="inline"
        ></a-menu>
      </a-layout-sider>
      <a-layout-content id="layout-content">
        <div class="content-container-box" v-bind="$attrs">
          <slot></slot>
        </div>
      </a-layout-content>
      <a-back-top v-if="backTop" :target="target"></a-back-top>
    </a-layout>
  </a-layout>
</template>
<style>
body {
  overflow: hidden;
}
</style>
<style lang="less" scoped>
@header-height: v-bind(headerHeight);
.page-layout-container {
  flex: 1;
  background-color: #fff;
  // min-height: unset;
  overflow: hidden;
  .ant-layout {
    background-color: #fff;
  }
}

#header {
  color: #fff;
  padding-inline: 24px 16px;
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: @header-height;
  line-height: @header-height;

  .logo-box {
    float: left;
    // width: 152px;
    margin-right: 24px;
    img {
      height: 30px;
      width: auto;
      vertical-align: middle;
    }
  }
  .nav-right {
    float: right;
  }
  .header-link {
    color: #fff;
  }
}
#sider-content-layout {
  margin-top: @header-height;
  height: calc(100vh - @header-height);
  overflow: hidden;

  #sider {
    overflow: auto;
    height: calc(100% - @header-height);

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.12);
      border-radius: 3px;
      box-shadow: inset 0 0 5px rgba(0, 21, 41, 0.05);
    }
    &::-webkit-scrollbar-track {
      background: hsla(0, 0%, 100%, 0.15);
      border-radius: 3px;
      box-shadow: inset 0 0 5px rgba(37, 37, 37, 0.05);
    }

    &.ant-layout-sider-light {
      border-right: 1px solid #e8e8e8;
      :deep(.ant-layout-sider-trigger) {
        border-right: 1px solid #e8e8e8;
        border-top: 1px solid #e8e8e8;
      }
    }

    .ant-menu-light.ant-menu-root {
      border-inline-end: none;
    }
  }

  #layout-content {
    overflow: auto;
    .content-container-box {
      padding: 16px;
    }
  }
}
</style>
