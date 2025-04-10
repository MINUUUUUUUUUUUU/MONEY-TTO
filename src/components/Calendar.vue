<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTradeListStore } from '@/stores/tradeList';
import { computed, reactive, watch } from 'vue';
import { useCalendarStore } from '@/stores/calendar';

const calendarStore = useCalendarStore();
const { handleMonth } = calendarStore;

const tradeListStore = useTradeListStore();
const tradeList = computed(() => tradeListStore.tradeList);

const convertToCalendarEvents = (tradeList) => {
  return tradeList.map((trade) => {
    const isIncome = trade.tradeType === '수입';
    return {
      title: `${isIncome ? '+' : '-'}${trade.tradeAmount.toLocaleString()}`,
      start: trade.tradeDate,
      color: isIncome ? 'rgba(51, 159, 70, 0.8)' : 'rgba(255, 138, 61, 0.8)',
      extendedProps: {
        description: trade.tradeDescription,
        category: trade.incomeCategory,
      },
    };
  });
};

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev',
    center: 'title',
    right: 'next',
  },
  contentHeight: 'auto',
  selectable: true,
  weekends: true,
  firstDay: 0,
  fixedWeekCount: false,
  locale: 'ko',
  events: [],
  datesSet: (arg) => {
    const date = new Date(arg.view.currentStart);
    handleMonth(date.getMonth());
  },
  dayCellContent: (arg) => {
    return { html: String(arg.date.getDate()) }; // 숫자만 리턴
  },
});

// tradeList를 감시하면서 캘린더에 넣을 이벤트로 변환
watch(
  tradeList,
  (newVal) => {
    calendarOptions.events = convertToCalendarEvents(newVal);
  },
  { immediate: true }
);
</script>

<style>
/* 🔹 요일 텍스트 (ex. 일, 월, 화...) */
.fc-col-header-cell-cushion {
  color: #808080;
  height: 100%;
  text-decoration: none;
}

/* 🔸 날짜 숫자 (ex. 1, 2, 3...) */
.fc-daygrid-day-number {
  text-decoration: none !important; /* 밑줄 제거 */
  color: #000000;
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: flex-start; /* 상단 정렬 */
  font-weight: 600;
}

.fc-daygrid-day-top {
  display: flex;
}

/* 🔸 셀 안 전체를 위에서 아래로 정렬 (숫자 + 이벤트 같이 정렬) */
.fc-daygrid-day-frame {
  display: flex;
  flex-direction: column;
}

/* 🔹 이벤트 텍스트 */
.fc-event-title {
  color: white;
  text-align: center;
  width: 100%;
}

/* 🔹 왼쪽(prev) 버튼 스타일 */
.fc-toolbar .fc-prev-button {
  background-color: #808080;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-weight: 600;
}

/* 🔹 오른쪽(next) 버튼 스타일 */
.fc-toolbar .fc-next-button {
  background-color: #808080;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-weight: 600;
}

/* 🔹 버튼 hover 효과 */
.fc-toolbar .fc-button:hover {
  opacity: 0.9;
}
</style>
