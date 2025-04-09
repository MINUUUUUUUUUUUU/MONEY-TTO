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
      color: isIncome ? 'green' : 'red',
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
  editable: true,
  weekends: true,
  firstDay: 0,
  fixedWeekCount: false,
  locale: 'ko',
  events: [],
  datesSet: (arg) => {
    const date = new Date(arg.view.currentStart);
    handleMonth(date.getMonth());
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
