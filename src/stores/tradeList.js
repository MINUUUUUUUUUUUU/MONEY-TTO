import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTradeListStore = defineStore('tradeList', () => {
  const tradeList = ref([]);

  const handleTradeList = (data) => {
    tradeList.value = data;
  };

  return {
    tradeList,
    handleTradeList,
  };
});
