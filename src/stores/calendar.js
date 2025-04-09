import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCalendarStore = defineStore('calendar', () => {
  const currentMonth = ref('');

  const handleMonth = (month) => {
    currentMonth.value = month + 1;
  };

  return {
    currentMonth,
    handleMonth,
  };
});
