<!-- CategoryAnalysis.vue -->
<template>
  <div>
    <div class="progress" style="height: 3em; position: relative">
      <div
        v-for="(category, index) in categoryData"
        :key="index"
        class="progress-bar"
        role="progressbar"
        :style="{ width: category.percentage + '%' }"
      >
        <span>{{ category.category }} </span>
        <span>{{ category.percentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTradeListStore } from '@/stores/tradeList';

const tradeListStore = useTradeListStore();

const expenseList = computed(() =>
  tradeListStore.tradeList.filter((trade) => trade.tradeType === '지출')
);

const categoryData = computed(() => {
  const categories = expenseList.value.map((trade) => trade.tradeMethod);
  const categoryCounts = {};
  categories.forEach((category) => {
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const total = categories.length;
  return Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    percentage: Number(((count / total) * 100).toFixed(1)),
  }));
});
</script>
