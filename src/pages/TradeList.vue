<template>
  <div
    v-for="trade in tradeList"
    :key="trade.tradeId"
    class="d-flex justify-content-between align-items-center py-2 border-bottom"
  >
    <!-- 좌측: 이모지 + 내용 -->
    <div class="d-flex align-items-center me-3 flex-grow-1">
      <!-- 카테고리 + 아이콘 영역 -->
      <div
        class="d-flex align-items-center flex-shrink-0 fixed-category-width me-3"
      >
        <span class="fw-semibold text-nowrap">{{
          trade.tradeType === '수입'
            ? trade.incomeCategory
            : trade.expenseCategory
        }}</span>
      </div>

      <!-- 세부 내용 -->
      <div class="overflow-hidden">
        <div class="fw-semibold text-secondary text-truncate">
          {{ trade.tradeDescription }}
        </div>
        <div class="text-muted small text-truncate">
          {{ trade.tradeMethod }}
        </div>
      </div>
    </div>

    <!-- 우측: 수입/지출 금액 -->
    <div class="d-flex align-items-center justify-content-end">
      <div
        :class="[
          'fw-littleBold',
          trade.tradeType === '수입' ? 'text-success' : 'text-danger',
        ]"
      >
        {{ trade.tradeType === '수입' ? '+' : '-' }}
        {{ trade.tradeAmount.toLocaleString() }}원
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
const tradeList = ref([]);
const tradeUrlPrefix = '/api/tradeList/';

const fetchTradeList = async () => {
  try {
    const response = await axios.get(tradeUrlPrefix);
    console.log(response.data);
    tradeList.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

fetchTradeList();
</script>
