import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userIndex: null,
  }),
  getters: {
    isLoggedIn: (state) => {
      return state.userIndex != null;
    },
  },
  actions: {
    hydrate() {
      const storeduserIndex = sessionStorage.getItem('userIndex');
      if (storeduserIndex) {
        this.userIndex = storeduserIndex;
      }
    },
    logout() {
      this.userIndex = null;
      sessionStorage.removeItem('userIndex');
    },
  },
});
