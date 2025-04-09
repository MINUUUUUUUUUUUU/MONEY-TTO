import { createRouter, createWebHistory } from 'vue-router';

import { useUserStore } from '@/stores/user-store.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    {
      path: '/register',
      name: 'register',
      component: () => import('../pages/Register.vue'),
    },

    // // 거래 추가 페이지
    // {
    //   path: '/trade/add',
    //   name: 'addTrade',
    //   component: () => import('../pages/AddTrade.vue'),
    // },
    // // 거래 리스트 페이지
    {
      path: '/trade',
      name: 'tradeList',
      component: () => import('../pages/TradeList.vue'),
    },
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

    // 사용자 정보 수정
    {
      path: '/profile/edit',
      name: 'editProfile',
      component: () => import('../pages/EditProfile.vue'),
    },

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

  userStore.hydrate();

  if (
    (to.path === '/login' || to.path === '/register') &&
    !userStore.isLoggedIn
  ) {
    next();
  }
  // 로그인하지 않았고, 접근하려는 경로가 로그인/회원가입이 아니면 로그인 페이지로 리다이렉트
  else if (
    !userStore.isLoggedIn &&
    to.path !== '/login' &&
    to.path !== '/register'
  ) {
    next('/login');
  }
  // 로그인한 사용자가 로그인 페이지에 접근하려고 하면 홈으로 리다이렉트
  else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/');
  }
  // 그 외는 정상 라우팅
  else {
    next();
  }
});

export default router;
