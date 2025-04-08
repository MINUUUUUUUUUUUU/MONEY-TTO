import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
  }),
  getters: {
    isLoggedIn: (state) => {
      return state.userId != null;
    },
  },
  actions: {},
});
