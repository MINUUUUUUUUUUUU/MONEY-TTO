<template>
  <div class="row text-center border-top border-bottom py-3">
    <!-- 총 수입 -->
    <div class="col">
      <div class="text-secondary fw-semibold">수입</div>
      <div class="text-success fw-bold total-font-size">
        {{ totalIncome.toLocaleString() }}<span class="text-success"></span>
      </div>
    </div>

    <!-- 총 지출 -->
    <div class="col">
      <div class="text-secondary fw-semibold">지출</div>
      <div class="text-danger fw-bold total-font-size">
        {{ totalExpense.toLocaleString() }}<span class="text-danger"></span>
      </div>
    </div>

    <!-- 총 잔액 -->
    <div class="col">
      <div class="text-secondary fw-semibold">합계</div>
      <div class="text-dark fw-bold total-font-size">
        {{ (totalIncome - totalExpense).toLocaleString() }}
        <span class="text-dark"></span>
      </div>
    </div>
  </div>

  <!-- 캘린더 로직 -->
  <div class="d-flex align-items-center gap-2 mt-3 mb-3">
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

  <!-- 거래 내역 출력 -->
  <div class="mb-6" v-if="dailyTradeList.length > 0">
    <!-- 이중 v-for dailyTradeList 가져오기 -->
    <div
      v-for="dailyTrade in dailyTradeList"
      :key="dailyTrade.date"
      class="justify-content-between align-items-start py-2"
    >
      <!-- 특정 날짜에 대한 총 수입, 지출 출력 -->
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
        <!-- 오늘 총 수입 -->
        <div class="d-flex align-items-center">
          <span class="text-success me-3 fw-littleBold">
            +{{ dailyTrade.dailyIncome.toLocaleString() }}원
          </span>
          <!-- 오늘 총 지출 -->
          <span class="text-danger fw-littleBold">
            -{{ dailyTrade.dailyExpense.toLocaleString() }}원
          </span>
        </div>
      </div>

      <!-- 이중 v-for 내부: 오늘 하루 거래에 대한 각 trade 항목 -->
      <div
        v-for="trade in dailyTrade.trades"
        :key="trade.tradeId"
        @click="navToTradeDetail(trade.id)"
        class="d-flex justify-content-between align-items-center py-2 border-bottom"
      >
        <div
          class="d-flex align-items-center me-3 flex-grow-1"
          style="min-width: 0"
        >
          <!-- 카테고리 -->
          <div
            class="d-flex align-items-center flex-shrink-0 fixed-category-width me-3"
          >
            <span class="fw-semibold text-nowrap">
              {{
                trade.tradeType === '수입'
                  ? trade.incomeCategory
                  : trade.expenseCategory
              }}
            </span>
          </div>

          <!-- 설명 -->
          <div class="overflow-hidden flex-grow-1" style="min-width: 0">
            <div class="fw-semibold text-secondary text-truncate d-block">
              {{ trade.tradeDescription }}
            </div>
            <div class="text-muted small text-truncate d-block">
              {{ trade.tradeMethod }}
            </div>
          </div>
        </div>

        <!-- 우측: 수입/지출 금액 -->
        <div
          class="d-flex align-items-center justify-content-end text-end flex-shrink-0"
        >
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
      <div class="position-fixed bottom-0 end-0 p-4">
        <!-- 지출 폼으로 이동하는 버튼 -->
      </div>
    </div>
  </div>

  <!-- 거래 내용이 없는 경우 출력 -->
  <div v-else class="text-center py-5 text-muted">작성된 내용이 없습니다.</div>
  <button
    class="btn btn-lg fs-2 size-2 d-flex justify-content-center align-items-center z-3 bg-carrot rounded-circle me-3 mb-3"
    style="position: fixed; bottom: 20px; right: 20px"
    @click="navToTradeAdd"
  >
    +
  </button>
</template>

<script setup>
// 캘린더 관련 라이브러리
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

// 숫자 관련 라이브러리

import axios from 'axios';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user-store'; // 경로는 실제 위치에 맞게 조정
import { useTradeStore } from '@/stores/trade-store';
import { onMounted } from 'vue';

// 수입 지출 리스트
const incomeList = ref([]);
const expenseList = ref([]);

// pinia
const userStore = useUserStore();
const tradeStore = useTradeStore();

// UrlPrefix
const incomeUrlPrefix = 'https://money-tto.glitch.me/incomeCategory/';
const expenseUrlPrefix = 'https://money-tto.glitch.me/expenseCategory/';

// 시작일 종료일
const startDate = ref(null);
const endDate = ref(null);

// 총 수입, 지출
const totalIncome = ref(0);
const totalExpense = ref(0);

// 라우트
const route = useRouter();

// 마운트 됐을 때
onMounted(() => {
  tradeStore.fetchTradeList(); // id 필터링 된 tradeList 가져오기(tradeStore.tradeList)
  userStore.hydrate(); // 세션에서 사용자 정보 불러오기
  // console.log('userId:', userStore.userId); // state 사용
  fetchIncomeList(); // 수입 리스트 가져오기
  fetchExpenseList(); // 지출 리스트 가져오기
});

// 날짜 포맷 지정 (YYYY-MM-DD)
const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0'
  )}`;
};

// axios로 수입 리스트 가져오기
const fetchIncomeList = async () => {
  try {
    const response = await axios.get(incomeUrlPrefix);
    incomeList.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

// axios로 지출 리스트 가져오기
const fetchExpenseList = async () => {
  try {
    const response = await axios.get(expenseUrlPrefix);
    expenseList.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

// 반환 값 dailyTradeList 생성 [날짜: , 오늘 수입: , 오늘 지출: , 오늘 거래 항목목: {}]
const dailyTradeList = computed(() => {
  // 날짜 객체 -> 문자열 YYYY-MM-DD로 포맷
  const formatDateToString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 기간별 정보 조회
  const tradesToUse =
    !startDate.value && !endDate.value
      ? tradeStore.tradeList
      : tradeStore.tradeList.filter((trade) => {
          const tradeDate = trade.tradeDate; // 문자열: 'YYYY-MM-DD'

          // 시작과 종료 날짜는 Data 객체로 formatDateToString으로 문자열 포매팅
          const start = startDate.value
            ? formatDateToString(startDate.value)
            : null;
          const end = endDate.value ? formatDateToString(endDate.value) : null;

          // start, end에 따른 기간별 리스트 조회
          if (start && end) {
            return tradeDate >= start && tradeDate <= end;
          } else if (start) {
            return tradeDate >= start;
          } else if (end) {
            return tradeDate <= end;
          }

          return true;
        });

  // 새로운 dailyTradeList 형태로 반환하는 과정 [날짜: , 오늘 수입: , 오늘 지출: , 오늘 거래 항목목: {}]
  const grouped = tradesToUse.reduce((acc, trade) => {
    const date = trade.tradeDate;

    // 카테고리 ID 통합 (수입/지출 구분)
    const categoryId =
      trade.tradeType === '수입' ? trade.incomeCategory : trade.expenseCategory;

    trade.categoryId = categoryId;

    // dailyTradeList에 해당 날짜가 존재하지 않는 경우 항목 생성 후 초기화
    if (!acc[date]) {
      acc[date] = {
        date,
        dailyIncome: 0,
        dailyExpense: 0,
        trades: [],
      };
    }

    // 일치하는 날짜의 dailyIncome과 dailyExpense 각각 누적합
    if (trade.tradeType === '수입') {
      acc[date].dailyIncome += trade.tradeAmount;
    } else {
      acc[date].dailyExpense += trade.tradeAmount;
    }

    acc[date].trades.push(trade);
    return acc;
  }, {});

  // 정렬
  return Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));
});

// computed에서 연산하면 무한 랜더링 문제로 총 수입, 총 지출을 따로 watch로 구현
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

// 거래 추가 페이지 이동
const navToTradeAdd = () => {
  route.push('/trade/add');
};

const navToTradeDetail = (tradeId) => {
  route.push(`/trade/${tradeId}`);
};
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
.bg-carrot {
  background-color: #ff8a3d;
  color: white;
}
.mb-6 {
  margin-bottom: 5.5rem !important;
}
</style>
