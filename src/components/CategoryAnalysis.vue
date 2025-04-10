<template>
  <div>
    <!-- 로딩 중일 때 -->
    <Loading v-if="isLoading" />

    <!-- 로딩 끝났을 때 -->
    <div v-else>
      <!-- 총 지출액 -->
      <div class="fs-3 fw-bold">{{ totalExpense.toLocaleString() }}원</div>

      <!-- 가로 막대 바 -->
      <div class="progress" style="height: 3em; position: relative">
        <div
          v-for="(category, index) in categoryData"
          :key="index"
          class="progress-bar text-white d-flex flex-column justify-content-center align-items-center"
          role="progressbar"
          :style="{
            width: category.percentage + '%',
            backgroundColor: getColor(category.category),
          }"
        ></div>
      </div>

      <!-- 아래 카테고리 상세 표 -->
      <ul class="list-group mt-3">
        <li
          v-for="(category, index) in categoryData"
          :key="'list-' + index"
          class="list-group-item d-flex align-items-center justify-content-between"
        >
          <div class="d-flex align-items-center">
            <!-- 색상 박스 -->
            <span
              class="me-2 rounded"
              :style="{
                backgroundColor: getColor(category.category),
                width: '16px',
                height: '16px',
                display: 'inline-block',
              }"
            ></span>
            <span>{{ category.category }} &nbsp;</span>
            <span>({{ category.percentage }}%)</span>
          </div>
          <span>{{ category.amount.toLocaleString() }}원</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user-store';
import { fetchTradeData } from '@/utils/month-analysis.js';
import Loading from '@/components/Loading.vue'; // 로딩 컴포넌트 import

const userStore = useUserStore();
const userId = userStore.userId;

const tradeList = ref([]);
const isLoading = ref(true); // 로딩 상태 추가

onMounted(async () => {
  try {
    const data = await fetchTradeData(userId);
    tradeList.value = data;
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
  } finally {
    isLoading.value = false; // 데이터 불러오기 끝나면 로딩 false
  }
});

// 현재 날짜
const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

// 이번 달 지출 내역
const expenseList = computed(() =>
  tradeList.value.filter((trade) => {
    if (trade.tradeType !== '지출' || !trade.tradeDate) return false;
    const date = new Date(trade.tradeDate);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  })
);

// 카테고리별 지출 계산
const categoryData = computed(() => {
  const categorySums = {};

  expenseList.value.forEach((trade) => {
    const category = trade.expenseCategory;
    const amount = trade.tradeAmount || 0;
    if (!categorySums[category]) categorySums[category] = 0;
    categorySums[category] += amount;
  });

  const total = Object.values(categorySums).reduce((sum, val) => sum + val, 0);

  return Object.entries(categorySums)
    .map(([category, sum]) => ({
      category,
      amount: sum,
      percentage: Number(((sum / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.percentage - a.percentage);
});

// 색상 매핑
const getColor = (category) => {
  const colorMap = {
    세금: '#a3bcd6',
    식비: '#eac9a5',
    주거: '#b5d3c1',
    보건: '#b7cee3',
    오락: '#dfb0c0',
    쇼핑: '#e2b3b3',
    교통: '#b0cbe1',
    저축: '#c0bce0',
    기타: '#d4d4d4',
  };
  return colorMap[category] || '#bbb';
};

// 총 지출액
const totalExpense = computed(() =>
  expenseList.value.reduce((sum, trade) => sum + (trade.tradeAmount || 0), 0)
);
</script>
