import { createRouter, createWebHistory } from 'vue-router';

import { useUserStore } from '@/stores/user-store.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 홈 페이지
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/Home.vue'),
    },

    // 로그인, 회원가입
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/Login.vue'),
    },
    // {
    //   path: '/register',
    //   name: 'register',
    //   component: () => import('../pages/Register.vue'),
    // },

    // // 거래 추가 페이지
    // {
    //   path: '/trade/add',
    //   name: 'addTrade',
    //   component: () => import('../pages/AddTrade.vue'),
    // },
    // // 거래 상세 페이지
    // {
    //   path: '/trade/:tradeId',
    //   name: 'tradeDetail',
    //   component: () => import('../pages/TradeDetail.vue'),
    // },
    // // 거래 수정 페이지
    // {
    //   path: '/trade/:tradeId/edit',
    //   name: 'editTrade',
    //   component: () => import('../pages/EditTrade.vue'),
    // },

    // // 사용자 정보 수정
    // {
    //   path: '/profile/edit',
    //   name: 'editProfile',
    //   component: () => import('../pages/EditProfile.vue'),
    // },

    // // Not Found
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'notFound',
    //   component: () => import('../pages/NotFound.vue'),
    // },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.path !== '/login' && !userStore.isLoggedIn) {
    next('/login');
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
