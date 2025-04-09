import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../pages/Home.vue';

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
    {
      path: '/register',
      name: 'register',
      component: () => import('../pages/Register.vue'),
    },

    // 거래 추가 페이지
    {
      path: '/trade/add',
      name: 'addTrade',
      component: () => import('../pages/transactions/AddTrade.vue'),
    },
    // 거래 리스트 페이지
    {
      path: '/trade',
      name: 'tradeList',
      component: () => import('../pages/TradeList.vue'),
    },
    // 거래 상세 페이지
    {
      path: '/trade/:id',
      name: 'tradeDetail',
      component: () => import('../pages/transactions/TradeDetail.vue'),
    },
    // 거래 수정 페이지
    {
      path: '/trade/:id/edit',
      name: 'editTrade',
      component: () => import('../pages/transactions//EditTrade.vue'),
    },

    // 사용자 정보 수정
    {
      path: '/profile/edit',
      name: 'editProfile',
      component: () => import('../pages/EditProfile.vue'),
    },

    // Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../pages/NotFound.vue'),
    },
  ],
});

export default router;