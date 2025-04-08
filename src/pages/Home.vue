<template>
  <!-- [FIX]  스타일 적용 방식 수정 필요-->
  <div class="container">
    <header
      class="d-flex align-items-center mb-4 justify-content-between"
      style="background-color: #ff8a3d; padding: 10px">
      <div>
        <div class="align-items-center d-flex">
          <h3>머니또</h3>
        </div>
      </div>

      <button class="btn">버튼</button>
    </header>

    <div class="mb-4">
      <div style="text-align: start">
        <div style="font-size: 18px; color: #4caf50; font-weight: bold">
          <a href="/" style="color: #4caf50; text-decoration: underline"
            >머니또</a
          >
          님, 안녕하세요
        </div>
      </div>
      <div
        class="d-flex flex-column"
        style="
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
        <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 8px">
          4 월 소비
        </h1>
        <hr />
        <p style="color: #339f46">수입 : {{ monthlyIncome }} 원</p>
        <p style="color: #ff5722">지출 : - {{ monthlyExpense }} 원</p>
      </div>
    </div>

    <!-- 달력 -->
    <FullCalendar :options="calendarOptions" />

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
            <span style="position: absolute; left: 5%; color: black"
              >{{ category.category }}
            </span>
            <span>{{ category.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import { useTradeListStore } from '@/stores/tradeList';

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev',
    center: 'title',
    right: 'next',
  },
  themeSystem: 'bootstrap',
  selectable: true,
  weekends: true,
  locale: 'ko',
  select: () => {},
};

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

// 거래 내역 가져오기
const fetchTradeList = async () => {
  try {
    // [FIXME] 로그인 기능 이후 userId값을 받아오는 것으로 수정 필요
    const userId = '1';
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

const sortedTradeList = (tradeList) => {
  return tradeList.sort((a, b) => {
    const dateA = Number(a.tradeDate.split('-').join(''));
    const dateB = Number(b.tradeDate.split('-').join(''));
    return dateB - dateA;
  });
};

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
    category.percentage = Number(category.percentage);
    console.log(category.percentage);
  });
  return categoryPercentages;
};

onMounted(async () => {
  await fetchTradeList();
  analysisExpense();
});
</script>
