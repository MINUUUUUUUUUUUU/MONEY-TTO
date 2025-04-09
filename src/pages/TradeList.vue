<template>
  <div class="d-flex align-items-center gap-2 mt-3">
    <VueDatePicker
      v-model="startDate"
      :format="formatDate"
      :start-date="startDate"
      :max-date="endDate"
      placeholder="시작일"
      :enable-time-picker="false"
    />
    <span class="mx-2">~</span>
    <VueDatePicker
      v-model="endDate"
      :format="formatDate"
      :min-date="startDate"
      :start-date="startDate"
      placeholder="종료일"
      :enable-time-picker="false"
    />
  </div>
  <div
    v-for="dailyTrade in dailyTradeList"
    :key="dailyTrade.date"
    class="justify-content-between align-items-start py-2"
  >
    <div
      class="d-flex justify-content-between align-items-center border-top border-bottom py-1"
    >
      <div class="d-flex align-items-center">
        <span class="fw-semibold text-secondary me-2">
          {{ dailyTrade.date }}
        </span>
        <!-- 요일 badge -->
        <span class="badge bg-dark">
          {{
            new Date(dailyTrade.date).toLocaleDateString('en-US', {
              weekday: 'short',
            })
          }}
        </span>
      </div>
      <div class="d-flex align-items-center">
        <span class="text-success me-3 fw-littleBold">
          +{{ dailyTrade.dailyIncome.toLocaleString() }}원
        </span>
        <span class="text-danger fw-littleBold">
          -{{ dailyTrade.dailyExpense.toLocaleString() }}원
        </span>
      </div>
    </div>

    <div
      v-for="trade in dailyTrade.trades"
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
            getCategoryName(trade.categoryId, trade.tradeType)
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
  </div>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import axios from 'axios';
import { computed, ref, watch } from 'vue';
const tradeList = ref([]);
const incomeList = ref([]);
const expenseList = ref([]);

const startDate = ref(null);
const endDate = ref(null);

const tradeUrlPrefix = '/api/tradeList/';
const incomeUrlPrefix = '/api/incomeCategory/';
const expenseUrlPrefix = '/api/expenseCategory/';

const fetchTradeList = async () => {
  try {
    const response = await axios.get(tradeUrlPrefix);
    console.log(response.data);
    tradeList.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

const fetchIncomeList = async () => {
  try {
    const response = await axios.get(incomeUrlPrefix);
    console.log(response.data);
    incomeList.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

const fetchExpenseList = async () => {
  try {
    const response = await axios.get(expenseUrlPrefix);
    console.log(response.data);
    expenseList.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

const getCategoryName = (categoryId, tradeType) => {
  const list = tradeType === '수입' ? incomeList.value : expenseList.value;
  const found = list.find((cat) => cat.id === categoryId);
  return found ? found.category : '기타';
};

const dailyTradeList = computed(() => {
  const grouped = tradeList.value.reduce((acc, trade) => {
    const date = trade.tradeDate;
    if (!acc[date]) {
      acc[date] = {
        date,
        dailyIncome: 0,
        dailyExpense: 0,
        trades: [],
      };
    }

    if (trade.tradeType === '수입') {
      acc[date].dailyIncome += trade.tradeAmount;
    } else {
      acc[date].dailyExpense += trade.tradeAmount;
    }

    acc[date].trades.push(trade);
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));
});

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0'
  )}`;
};

fetchTradeList();
fetchIncomeList();
fetchExpenseList();
</script>
