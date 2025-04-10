<template>
  <div class="container">
    <!-- 회원 환영 표시 및  -->
    <div class="mb-4">
      <div style="text-align: start">
        <div class="fs-5 text-success fw-bold">
          <a href="/" style="color: #4caf50; text-decoration: underline">
            {{ nickname }}
          </a>
          님, 안녕하세요
        </div>
      </div>
      <div class="d-flex flex-column card p-3 shadow-sm">
        <div class="fw-bold fs-4">{{ currentMonth }} 월 소비</div>
        <hr />
        <p class="text-success">수입 : {{ tradeSummary.monthlyIncome }} 원</p>
        <p class="text-danger">지출 : - {{ tradeSummary.monthlyExpense }} 원</p>
      </div>
    </div>

    <!-- 달력 -->
    <Calender />

    <!-- 분석 탭 -->
    <div class="mt-4">
      <div class="tabs mb-3">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: showMonthly }"
              href="#"
              @click.prevent="showMonthlyAnalysis"
            >
              월별 소비 분석
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: showCategory }"
              href="#"
              @click.prevent="showCategoryAnalysis"
            >
              카테고리 별 소비 분석
            </a>
          </li>
        </ul>
      </div>

      <!-- 월 별 소비 분석 -->
      <div v-if="showMonthly" class="list-group">
        <MonthAnalysis />
      </div>
      <!-- 카테고리 별 소비 분석 -->
      <div v-if="showCategory">
        <CategoryAnalysis />
      </div>
    </div>
    <button
      class="btn btn-success btn-lg rounded-circle position-fixed fs-2 size-2 d-flex justify-content-center align-items-center z-3 shadow-sm"
      style="bottom: 3rem; right: 3rem"
      @click="navToTradeAdd"
    >
      +
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useTradeListStore } from '@/stores/tradeList';
import { useCalendarStore } from '@/stores/calendar';
import Calender from '@/components/Calendar.vue';
import CategoryAnalysis from '@/components/CategoryAnalysis.vue';
import MonthAnalysis from '@/components/MonthAnalysis.vue';
import { useUserStore } from '@/stores/user-store';

const userStore = useUserStore();
const nickname = ref('');
const monthlyData = ref(Array(13).fill(0));

// 거래 내역 가져오기
const tradeListStore = useTradeListStore();
const { handleTradeList } = tradeListStore;

const tradeList = computed(() => {
  return tradeListStore.tradeList;
});

const expenseList = computed(() => {
  return tradeList.value.filter((trade) => trade.tradeType === '지출');
});

// 월별 거래 총액 가져오기
const fetchTradeTotal = async (userId) => {
  try {
    // /tradeList 엔드포인트에서 데이터 가져오기
    const response = await axios.get(`/api/tradeList?userId=${userId}`);
    const tradeList = response.data;

    // 사용자 ID에 해당하는 거래만 필터링

    // 월별 거래 총액 계산
    const monthlyData = tradeList.reduce((acc, trade) => {
      const month = new Date(trade.tradeDate).getMonth() + 1; // 월은 0부터 시작하므로 +1
      const amount = trade.tradeAmount;

      if (!acc[month]) {
        acc[month] = 0;
      }

      acc[month] += amount;
      return acc;
    }, {});

    // 결과를 monthlyData 객체에 저장
    return monthlyData;
  } catch (err) {
    console.error('데이터 불러오기 실패:', err);
    return {};
  }
};

// 월별 수입과 지출 계산
const tradeSummary = computed(() => {
  const income = tradeList.value
    .filter((trade) => trade.tradeType === '수입')
    .reduce((sum, trade) => sum + trade.tradeAmount, 0);

  const expense = tradeList.value
    .filter((trade) => trade.tradeType === '지출')
    .reduce((sum, trade) => sum + trade.tradeAmount, 0);

  return {
    monthlyIncome: income.toLocaleString(),
    monthlyExpense: expense.toLocaleString(),
  };
});

// [년도,월] 상태 관리
const calendarStore = useCalendarStore();
const currentMonth = computed(() => calendarStore.currentMonth);

// 탭과 관련된 상태 관리
const showMonthly = ref(true);
const showCategory = ref(false);

const showMonthlyAnalysis = () => {
  showMonthly.value = true;
  showCategory.value = false;
};
const showCategoryAnalysis = () => {
  showMonthly.value = false;
  showCategory.value = true;
};

// 회원 닉네임 가져오기
const fetchUserNickName = async (userId) => {
  try {
    const response = await axios.get(`/api/users`);
    const user = response.data.filter((user) => user.userId == userId);
    nickname.value = user[0].nickname;
  } catch (err) {
    console.error(err);
  }
};

// 거래 내역 가져오기
const fetchTradeList = async (userId) => {
  try {
    // [FIXME] 로그인 기능 이후 userId값을 받아오는 것으로 수정 필요
    const response = await axios.get('/api/tradeList');
    const filteredTradeList = response.data.filter(
      (trade) => trade.userId === userId
    );

    sortedTradeList(filteredTradeList);
    handleTradeList(filteredTradeList);
    return filteredTradeList;
  } catch (err) {
    console.error(err);
  }
};

// 거래 내역을 날짜 기준으로 내림차순 정렬
const sortedTradeList = (tradeList) => {
  return tradeList.sort((a, b) => {
    const dateA = Number(a.tradeDate.split('-').join(''));
    const dateB = Number(b.tradeDate.split('-').join(''));
    return dateB - dateA;
  });
};

const route = useRouter();
// 거래 추가 페이지로 이동
const navToTradeAdd = () => {
  route.push('/trade/add');
};

onMounted(async () => {
  await fetchTradeList(userStore.userId);
  fetchUserNickName(userStore.userId);
  fetchTradeTotal(userStore.userId);
});
</script>
