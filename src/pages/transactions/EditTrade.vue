<template>
  <div class="container mt-4">
    <div class="custom-tab-line">
      <div
        class="tab-item"
        :class="{ active: isExpense, orange: isExpense }"
        @click="handleTabClick(true)"
      >
        지출
      </div>
      <div
        class="tab-item"
        :class="{ active: !isExpense, green: !isExpense }"
        @click="handleTabClick(false)"
      >
        수입
      </div>
    </div>

    <!-- 거래 입력 폼 -->
    <form class="form-layout" @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label"
          ><span class="text-danger">* </span>일자</label
        >
        <input type="date" class="form-control" v-model="date" required />
      </div>

      <div class="mb-3">
        <label class="form-label"
          ><span class="text-danger">*</span> 금액</label
        >
        <div class="d-flex align-items-center gap-2">
          <span
            :class="[
              'amount-icon',
              isExpense ? 'text-warning' : 'text-success',
            ]"
          >
            {{ isExpense ? '−' : '+' }}
          </span>
          <input
            type="number"
            class="form-control amount-input"
            v-model.number="amount"
            @focus="isFocused = true"
            @blur="isFocused = false"
            :class="{
              'input-orange': isExpense && isFocused,
              'input-green': !isExpense && isFocused,
            }"
            required
            min="1"
          />
        </div>
      </div>

      <!-- 지출일 경우에만 결제 수단 선택 -->
      <div v-if="isExpense" class="mb-3">
        <label class="form-label"
          ><span class="text-danger">* </span>결제 수단</label
        >
        <select class="form-select" v-model="paymentMethod" required>
          <option value="" disabled>선택</option>
          <option value="현금">현금</option>
          <option value="신용카드">신용카드</option>
          <option value="계좌이체">계좌이체</option>
          <option value="체크카드">체크카드</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label"
          ><span class="text-danger">*</span> 카테고리</label
        >
        <select class="form-select" v-model="category" required>
          <option value="" disabled selected>선택</option>
          <option
            v-for="option in categoryOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">메모</label>
        <textarea
          class="form-control"
          v-model="memo"
          placeholder="내용 설명"
          rows="3"
        ></textarea>
      </div>

      <!-- 버튼 -->
      <div class="fixed-actions">
        <button type="button" class="btn cancel-btn" @click="handleCancel">
          닫기
        </button>
        <button
          type="submit"
          :class="[
            'btn',
            'text-white',
            isExpense ? 'save-expense' : 'save-income',
          ]"
        >
          저장
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import '@/assets/addTrade.css';

const route = useRoute();
const router = useRouter();
const id = String(route.params.id); // 기존 거래 ID

const isExpense = ref(true);
const date = ref('');
const amount = ref(0);
const paymentMethod = ref('');
const category = ref('');
const memo = ref('');
const isFocused = ref(false);

const categoryOptions = computed(() => {
  return isExpense.value
    ? ['세금', '식비', '주거', '보건', '오락', '교통', '통신', '저축']
    : ['급여', '용돈', '상여금', '기타 수입'];
});

// ✅ 거래 정보 불러오기
const fetchTrade = async () => {
  try {
    const res = await axios.get(`https://money-tto.glitch.me/tradeList/${id}`);
    const trade = res.data;

    isExpense.value = trade.tradeType === '지출';
    date.value = trade.tradeDate;
    amount.value = trade.tradeAmount;
    memo.value = trade.tradeDescription;

    if (isExpense.value) {
      paymentMethod.value = trade.tradeMethod;

      // 💡 expenseCategory 값 매핑
      const categoryRes = await axios.get(
        'https://money-tto.glitch.me/expenseCategory'
      );
      const found = categoryRes.data.find(
        (c) =>
          String(c.id) === String(trade.expenseCategory) ||
          c.category === trade.expenseCategory
      );
      category.value = found?.category || trade.expenseCategory;
    } else {
      const categoryRes = await axios.get(
        'https://money-tto.glitch.me/incomeCategory'
      );
      const found = categoryRes.data.find(
        (c) =>
          String(c.id) === String(trade.incomeCategory) ||
          c.category === trade.incomeCategory
      );
      category.value = found?.category || trade.incomeCategory;
    }
  } catch (err) {
    console.error('[조회 오류]', err);
    alert('거래 내역을 불러올 수 없습니다.');
    router.push('/');
  }
};

// ✅ 수정 제출
const handleSubmit = async () => {
  const trade = {
    id,
    tradeId: id,
    tradeType: isExpense.value ? '지출' : '수입',
    tradeDate: date.value,
    tradeAmount: amount.value,
    tradeDescription: memo.value,
    userId: '1',
  };

  if (isExpense.value) {
    trade.expenseCategory = category.value;
    trade.tradeMethod = paymentMethod.value;
  } else {
    trade.incomeCategory = category.value;
  }

  try {
    await axios.put(`https://money-tto.glitch.me/tradeList/${id}`, trade);
    alert('거래 내역이 수정되었습니다!');
    router.push(`/trade/${id}`); // 수정 후 상세 페이지로 이동
  } catch (err) {
    console.error('[수정 실패]', err);
    alert('수정에 실패했습니다.');
  }
};

const handleCancel = () => {
  const isConfirmed = confirm(
    '수정 내용이 저장되지 않습니다. 정말 나가시겠습니까?'
  );
  if (isConfirmed) {
    router.push(`/trade/${id}`);
  }
};

// 탭 클릭 제어 함수
const handleTabClick = (targetIsExpense) => {
  if (targetIsExpense !== isExpense.value) {
    alert(
      `현재 ${isExpense.value ? '지출' : '수입'} 내역을 수정 중입니다.\n` +
        `${targetIsExpense ? '지출' : '수입'} 내역은 수정할 수 없습니다.`
    );
    return;
  }
};

onMounted(fetchTrade);
</script>
