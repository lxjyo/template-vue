import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import HomeView from '@/views/HomeView.vue';

const scrollBehavior = () => {
  // base-Layout 内容渲染区域
  const scrollElement = document.querySelector('#layout-content');
  if (scrollElement) {
    scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
  }
  return {
    top: 0,
    behavior: 'smooth'
  };
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior,
  routes: [
    {
      path: '/',
      name: '',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    }
  ]
});

router.beforeEach(() => {
  NProgress.start();
  return true;
});
router.afterEach(() => {
  NProgress.done();
});

export default router;
