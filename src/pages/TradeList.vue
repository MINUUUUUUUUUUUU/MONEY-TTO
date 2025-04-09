<template>
  <div class="row text-center border-top border-bottom py-3">
    <!-- 총 수입 -->
    <div class="col">
      <div class="text-secondary fw-semibold">수입</div>
      <div class="text-success fw-bold total-font-size">
        {{ totalIncome.toLocaleString() }}<span class="text-success">원</span>
      </div>
    </div>

    <!-- 총 지출 -->
    <div class="col">
      <div class="text-secondary fw-semibold">지출</div>
      <div class="text-danger fw-bold total-font-size">
        {{ totalExpense.toLocaleString() }}<span class="text-danger">원</span>
      </div>
    </div>

    <!-- 총 잔액 -->
    <div class="col">
      <div class="text-secondary fw-semibold">총 잔액</div>
      <div class="text-dark fw-bold total-font-size">
        {{ (totalIncome - totalExpense).toLocaleString() }}
        <span class="text-dark">원</span>
      </div>
    </div>
  </div>

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

import { useUserStore } from '@/stores/user-store'; // 경로는 실제 위치에 맞게 조정
import { useTradeStore } from '@/stores/trade-store';
import { onMounted } from 'vue';

const incomeList = ref([]);
const expenseList = ref([]);

const userStore = useUserStore();
const tradeStore = useTradeStore();

const incomeUrlPrefix = '/api/incomeCategory/';
const expenseUrlPrefix = '/api/expenseCategory/';
const startDate = ref(null);
const endDate = ref(null);
const totalIncome = ref(0);
const totalExpense = ref(0);
const totalBalance = ref(0);

onMounted(() => {
  userStore.hydrate(); // 세션에서 사용자 정보 불러오기
  console.log('userId:', userStore.userId); // state 사용
  fetchIncomeList();
  fetchExpenseList();
  tradeStore.fetchTradeList();
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

// const fetchTradeList = async () => {
//   try {
//     const response = await axios.get(tradeUrlPrefix);
//     console.log(response.data);

//     // userId가 일치하는 항목만 필터링
//     tradeList.value = response.data.filter(
//       (trade) => trade.userId === userStore.userId
//     );
//   } catch (err) {
//     console.log(err);
//   }
// };

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
  // 날짜 객체 -> 문자열 YYYY-MM-DD로 포맷
  const formatDateToString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const tradesToUse =
    !startDate.value && !endDate.value
      ? tradeStore.tradeList
      : tradeStore.tradeList.filter((trade) => {
          const tradeDate = trade.tradeDate; // 문자열: 'YYYY-MM-DD'
          const start = startDate.value
            ? formatDateToString(startDate.value)
            : null;
          const end = endDate.value ? formatDateToString(endDate.value) : null;

          if (start && end) {
            return tradeDate >= start && tradeDate <= end;
          } else if (start) {
            return tradeDate >= start;
          } else if (end) {
            return tradeDate <= end;
          }

          return true;
        });

  const grouped = tradesToUse.reduce((acc, trade) => {
    const date = trade.tradeDate;

    // 👉 카테고리 ID 통합 (수입/지출 구분)
    const categoryId =
      trade.tradeType === '수입' ? trade.incomeCategory : trade.expenseCategory;

    // 필요한 경우 categoryId를 trade에 추가 (원본 수정이 아니라 clone하는 게 더 안전)
    trade.categoryId = categoryId;

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

watch(
  dailyTradeList,
  (list) => {
    let income = 0;
    let expense = 0;

    list.forEach((day) => {
      income += day.dailyIncome;
      expense += day.dailyExpense;
    });

    totalIncome.value = income;
    totalExpense.value = expense;
  },
  { immediate: true }
);
</script>
<style scoped>
.fw-littleBold {
  font-weight: 500 !important;
}
.fixed-category-width {
  min-width: 100px;
  max-width: 150px;
}
.total-font-size {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  text-shadow: 1px 1px 2px #ddd;
}
</style>
