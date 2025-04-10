import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from './user-store';

export const useTradeStore = defineStore('trade', () => {
  const tradeList = ref([]);
  const tradeUrlPrefix = 'https://money-tto.glitch.me/tradeList/';

  const userStore = useUserStore();

  const fetchTradeList = async () => {
    try {
      const response = await axios.get(tradeUrlPrefix);
      // console.log(response.data);

      // userId가 일치하는 항목만 필터링
      tradeList.value = response.data.filter(
        (trade) => trade.userId === userStore.userId
      );
    } catch (err) {
      console.error('fetchTradeList error:', err);
    }
  };

  return {
    tradeList,
    fetchTradeList,
  };
});
