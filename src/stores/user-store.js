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
  actions: {
    hydrate() {
      const storedUserId = sessionStorage.getItem('userId');
      if (storedUserId) {
        this.userId = storedUserId;
        console.log(storedUserId);
        console.log(this.userId);
      }
    },
    logout() {
      this.userId = null;
      sessionStorage.removeItem('userId');
    },
  },
});
