<template>
  <div
    v-for="trade in tradeList"
    :key="trade.tradeId"
    class="d-flex align-items-center me-3"
  >
    <!-- 카테고리 + 아이콘 영역 -->
    <div
      class="d-flex align-items-center flex-shrink-0"
      style="min-width: 100px; max-width: 150px"
    >
      <span class="fs-5 me-1">{{ trade.tradeCategory.split(' ')[0] }}</span>
      <span class="fw-semibold text-nowrap">
        {{ trade.tradeCategory.split(' ')[1] }}
      </span>
    </div>

    <!-- 세부 내용 -->
    <div class="overflow-hidden">
      <div class="fw-semibold text-secondary text-truncate">
        {{ trade.tradeDescription }}
      </div>
      <div class="text-muted small text-truncate">
        {{ trade.tradeDate }} {{ trade.tradeMethod }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const tradeList = ref([
  {
    tradeId: '1',
    tradeType: '수입',
    tradeAmount: 500000,
    tradeCategory: '💰️ 급여',
    tradeDate: '2025-04-01',
    tradeMethod: '이체',
    tradeDescription: '3월 급여 입금',
    userId: '1',
  },
  {
    tradeId: '2',
    tradeType: '지출',
    tradeAmount: 15000,
    tradeCategory: '🍗 식비',
    tradeDate: '2025-04-02',
    tradeMethod: '카드',
    tradeDescription: '점심 식사',
    userId: '1',
  },
  {
    tradeId: '3',
    tradeType: '지출',
    tradeAmount: 20000,
    tradeCategory: '🚌교통비',
    tradeDate: '2025-04-03',
    tradeMethod: '현금',
    tradeDescription: '택시비',
    userId: '2',
  },
  {
    tradeId: '4',
    tradeType: '수입',
    tradeAmount: 300000,
    tradeCategory: '💰️ 급여',
    tradeDate: '2025-04-01',
    tradeMethod: '이체',
    tradeDescription: '3월 급여 입금',
    userId: '3',
  },
  {
    tradeId: '5',
    tradeType: '지출',
    tradeAmount: 50000,
    tradeCategory: '💰️ 세금',
    tradeDate: '2025-04-04',
    tradeMethod: '카드',
    tradeDescription: '월세 납부',
    userId: '4',
  },
  {
    tradeId: '6',
    tradeType: '지출',
    tradeAmount: 12000,
    tradeCategory: '🍗 식사',
    tradeDate: '2025-04-05',
    tradeMethod: '현금',
    tradeDescription: '저녁 식사',
    userId: '5',
  },
]);
</script>
