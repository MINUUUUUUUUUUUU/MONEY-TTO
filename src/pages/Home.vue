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
        <div class="fw-bold fs-4">4 월 소비</div>
        <hr />
        <p class="text-success">수입 : {{ monthlyIncome }} 원</p>
        <p class="text-danger">지출 : - {{ monthlyExpense }} 원</p>
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
              @click.prevent="showMonthlyAnalysis">
              월별 소비 분석
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: showCategory }"
              href="#"
              @click.prevent="showCategoryAnalysis">
              카테고리 별 소비 분석
            </a>
          </li>
        </ul>
      </div>

      <!-- 월 별 소비 분석 -->
      <div v-if="showMonthly" class="list-group">
        <div
          v-if="tradeList.length === 0"
          class="list-group-item d-flex justify-content-center align-items-center">
          <span>불러오는 중...</span>
        </div>
        <div
          v-else
          v-for="trade in tradeList"
          :key="trade.tradeId"
          class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">{{ trade.tradeDate }}</h6>
            <div class="text-muted">{{ trade.tradeType }}</div>
          </div>
          <span
            :class="{
              'text-success': trade.tradeType == '수입',
              'text-danger': trade.tradeType == '지출',
            }">
            {{ trade.tradeAmount }}
          </span>
        </div>
      </div>

      <!-- 카테고리 별 소비 분석 -->
      <div v-if="showCategory">
        <h3>카테고리 별 소비 분석</h3>
        <div class="progress" style="height: 3em; position: relative">
          <div
            v-for="(category, index) in analysisExpense()"
            :key="index"
            class="progress-bar"
            role="progressbar"
            :style="{ width: category.percentage + '%' }">
            <span>{{ category.category }} </span>
            <span>{{ category.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
    <button
      class="btn btn-success btn-lg rounded-circle position-fixed fs-2 size-2 d-flex justify-content-center align-items-center z-3 shadow-sm"
      style="bottom: 3rem; right: 3rem"
      @click="navToTradeAdd">
      +
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useTradeListStore } from '@/stores/tradeList';
import Calender from '@/components/Calendar.vue';

const nickname = ref('');
const tradeListStore = useTradeListStore();
const tradeList = computed(() => {
  return tradeListStore.tradeList;
});

const expenseList = computed(() => {
  return tradeList.value.filter((trade) => trade.tradeType === '지출');
});

const monthlyIncome = computed(() => {
  return tradeList.value
    .filter((trade) => trade.tradeType === '수입')
    .reduce((acc, trade) => acc + trade.tradeAmount, 0)
    .toLocaleString();
});

const monthlyExpense = computed(() => {
  return tradeList.value
    .filter((trade) => trade.tradeType === '지출')
    .reduce((acc, trade) => acc + trade.tradeAmount, 0)
    .toLocaleString();
});

const { handleTradeList } = tradeListStore;

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
    const response = await axios.get(`http://localhost:3000/users`);
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
    const response = await axios.get('http://localhost:3000/tradeList');
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

// 카테고리 별 소비 분석
const analysisExpense = () => {
  const categories = expenseList.value.map((trade) => trade.tradeMethod);
  const categoryCounts = {};
  categories.forEach((category) => {
    if (categoryCounts[category]) {
      categoryCounts[category]++;
    } else {
      categoryCounts[category] = 1;
    }
  });
  const totalCount = categories.length;
  const categoryPercentages = Object.entries(categoryCounts).map(
    ([category, count]) => {
      return {
        category,
        percentage: (count / totalCount) * 100,
      };
    }
  );
  categoryPercentages.forEach((category) => {
    category.percentage = Number(category.percentage).toFixed(1);
  });
  return categoryPercentages;
};

const route = useRouter();
// 거래 추가 페이지로 이동
const navToTradeAdd = () => {
  route.push('/trade/add');
};

onMounted(async () => {
  await fetchTradeList('1');
  analysisExpense();
  fetchUserNickName('1');
});
</script>
