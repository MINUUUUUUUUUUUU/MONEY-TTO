<template>
  <div>
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
      >
        <span>{{ category.category }}</span>
        <span>{{ category.percentage }}%</span>
      </div>
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
          <span>{{ category.category }}</span>
        </div>
        <span>{{ category.amount.toLocaleString() }}원</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTradeListStore } from '@/stores/tradeList';

const tradeListStore = useTradeListStore();

// 지출 내역만 추출
const expenseList = computed(() =>
  tradeListStore.tradeList.filter((trade) => trade.tradeType === '지출')
);

// 카테고리 데이터 (category 필드 기준)
const categoryData = computed(() => {
  const categorySums = {};

  expenseList.value.forEach((trade) => {
    const category = trade.expenseCategory;
    const amount = trade.tradeAmount || 0;
    if (!categorySums[category]) {
      categorySums[category] = 0;
    }
    categorySums[category] += amount;
  });

  const total = Object.values(categorySums).reduce((sum, val) => sum + val, 0);

  return Object.entries(categorySums)
    .map(([category, sum]) => ({
      category,
      amount: sum,
      percentage: Number(((sum / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.percentage - a.percentage); // ⬅ 이 부분 추가!
});

const getColor = (category) => {
  const colorMap = {
    세금: '#a3bcd6', // 차분한 블루그레이
    식비: '#eac9a5', // 은은한 베이지 오렌지
    주거: '#b5d3c1', // 톤다운 민트
    보건: '#b7cee3', // 연한 그레이 블루
    오락: '#dfb0c0', // 톤 다운된 로즈핑크
    쇼핑: '#e2b3b3', // 코랄 느낌의 로우톤 핑크
    교통: '#b0cbe1', // 흐린 하늘색
    저축: '#c0bce0', // 회색기 있는 보라
    기타: '#d4d4d4', // 뉴트럴 연회색
  };
  return colorMap[category] || '#bbb'; // 기본 흐린 회색
};

// 총 지출액 계산
const totalExpense = computed(() => {
  return expenseList.value.reduce(
    (sum, trade) => sum + (trade.tradeAmount || 0),
    0
  );
});
</script>
