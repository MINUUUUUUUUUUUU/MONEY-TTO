<template>
  <canvas id="spendingChart" width="400" height="200"></canvas>
</template>
<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user-store';
import {
  fetchTradeData,
  calculateMonthlySpending,
  renderChart,
} from '@/utils/month-analysis.js';

const userStore = useUserStore();

const userIndex = userStore.userIndex;

onMounted(async () => {
  try {
    const data = await fetchTradeData(userIndex);
    const { incomeData, expenseData } = calculateMonthlySpending(data);
    const canvas = document.getElementById('spendingChart');
    if (canvas instanceof HTMLCanvasElement) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        renderChart(ctx, incomeData, expenseData);
      } else {
        console.error('2D 컨텍스트를 가져올 수 없습니다.');
      }
    } else {
      console.error('Canvas 요소를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
  }
});
</script>
