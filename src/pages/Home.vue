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
        <p style="margin: 0; color: #757575">수입 : + 123,456</p>
        <p style="margin: 0; color: #ff5722; font-weight: bold">
          지출 : - 32,600
        </p>
      </div>
    </div>

    <!-- 달력 -->
    <div class="w-100 d-flex flex-column align-items-center mb-4">
      <div class="d-flex justify-content- align-items-center mb-2">
        <button class="btn btn-sm btn-outline-secondary" @click="prevMonth">
          &lt;
        </button>
        <h3>{{ currentMonth + 1 }} 월</h3>
        <button class="btn btn-sm btn-outline-secondary" @click="nextMonth">
          &gt;
        </button>
      </div>

      <!-- 캘린더  -->
      <table class="table table-bordered table-sm text-center">
        <thead>
          <th>일</th>
          <th>월</th>
          <th>화</th>
          <th>수</th>
          <th>목</th>
          <th>금</th>
          <th>토</th>
        </thead>
        <tbody>
          <tr v-for="(week, index) in calendarRows" :key="index">
            <td class="" v-for="(day, index) in week">
              <div class="d-flex flex-column align-items-center">
                <span>{{ day }}</span>
                <span v-if="day">수입</span>
                <span v-if="day">지출</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 분석 탭 -->
    <div>
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
      <div v-if="showMonthly">
        <h3>월별 소비 분석</h3>
        <p>123,450 원</p>
        <div class="progress">
          <div
            class="progress-bar bg-primary"
            role="progressbar"
            style="width: 25%"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"></div>
        </div>
      </div>

      <!-- 카테고리 별 소비 분석 -->
      <div v-if="showCategory">
        <h3>카테고리 별 소비 분석</h3>
        <div class="progress" style="height: 30px; position: relative">
          <div
            class="progress-bar"
            role="progressbar"
            style="width: 22%; background-color: #ffce00"
            aria-valuenow="22"
            aria-valuemin="0"
            aria-valuemax="100">
            <span style="position: absolute; left: 5%; color: black"
              >교육 22%</span
            >
          </div>
          <div
            class="progress-bar"
            role="progressbar"
            style="width: 44%; background-color: #ff8a3d"
            aria-valuenow="44"
            aria-valuemin="0"
            aria-valuemax="100">
            <span style="position: absolute; left: 30%; color: white"
              >쇼핑 44%</span
            >
          </div>
          <div
            class="progress-bar"
            role="progressbar"
            style="width: 22%; background-color: #6cc24a"
            aria-valuenow="22"
            aria-valuemin="0"
            aria-valuemax="100">
            <span style="position: absolute; left: 60%; color: white"
              >오락 22%</span
            >
          </div>
          <div
            class="progress-bar"
            role="progressbar"
            style="width: 22%; background-color: #ff5e57"
            aria-valuenow="22"
            aria-valuemin="0"
            aria-valuemax="100">
            <span style="position: absolute; left: 85%; color: white"
              >교통 22%</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const showMonthly = ref(false);
const showCategory = ref(true);

const showMonthlyAnalysis = () => {
  showMonthly.value = true;
  showCategory.value = false;
};
const showCategoryAnalysis = () => {
  showMonthly.value = false;
  showCategory.value = true;
};

// 캘린더 데이터 가져오기
const date = new Date();
const currentMonth = ref(date.getMonth());
const currentYear = ref(date.getFullYear());

const prevMonth = () => {
  currentMonth.value = date.getMonth() - 1;
  date.setMonth(date.getMonth() - 1);
  if (currentMonth.value < 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  }
  console.log(currentMonth.value);
  console.log(calendarRows);
  console.log(currentYear.value);
};

const nextMonth = () => {
  currentMonth.value = date.getMonth() + 1;
  date.setMonth(date.getMonth() + 1);
  if (currentMonth.value > 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  }
  console.log(currentMonth.value);
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month - 1, 1).getDay();
};

const daysInMonth = getDaysInMonth(currentYear.value, currentMonth.value);

const firstDayOfMonth = getFirstDayOfMonth(
  currentYear.value,
  currentMonth.value
);

const calendar = reactive({
  days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
  firstDay: firstDayOfMonth,
});

// 매달 일 수 계산
const calendarRows = [];
for (let i = 0; i < Math.ceil((daysInMonth + firstDayOfMonth) / 7); i++) {
  const weekStart = i * 7;
  const weekEnd = weekStart + 7;
  calendarRows.push(calendar.days.slice(weekStart, weekEnd));
}
</script>
