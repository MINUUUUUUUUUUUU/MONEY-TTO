<template>
  <div class="container mt-4">
    <Alert v-if="alertMessage" :message="alertMessage" :type="alertType" :duration="2000" />
    <!-- 탭: 지출 / 수입 -->
    <div class="custom-tab-line">
      <div class="tab-item" :class="{ active: isExpense, orange: isExpense }" @click="isExpense = true">
        지출
      </div>
      <div class="tab-item" :class="{ active: !isExpense, green: !isExpense }" @click="isExpense = false">
        수입
      </div>
    </div>


    <!-- 거래 입력 폼 -->
    <form class="form-layout" @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label"><span class="text-danger">* </span>일자</label>
        <input
          type="date"
          class="form-control"
          v-model="date"
          :max="today"
          required
        />

      </div>

      <div class="mb-3">
        <label class="form-label"><span class="text-danger">*</span> 금액</label>
        <div class="d-flex align-items-center gap-2">
          <span :class="['amount-icon', isExpense ? 'text-warning' : 'text-success']">
            {{ isExpense ? '−' : '+' }}
          </span>
          <input type="number" class="form-control amount-input" v-model.number="amount" @focus="isFocused = true"
            @blur="isFocused = false" :class="{
              'input-orange': isExpense && isFocused,
              'input-green': !isExpense && isFocused
            }" required min="1" />
        </div>
      </div>




      <!-- 지출일 경우에만 결제 수단 선택 -->
      <div v-if="isExpense" class="mb-3">
        <label class="form-label"><span class="text-danger">* </span>결제 수단</label>

        <select class="form-select" v-model="paymentMethod" required>
          <option value="" disabled selected>선택</option>
          <option value="현금">현금</option>
          <option value="신용카드">신용카드</option>
          <option value="계좌이체">계좌이체</option>
          <option value="체크카드">체크카드</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label"><span class="text-danger">*</span> 카테고리</label>
        <select class="form-select" v-model="category" required>
          <option value="" disabled selected>선택</option>
          <option v-for="option in categoryOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>


      <div class="mb-3">
        <label class="form-label">메모</label>
        <textarea class="form-control" v-model="memo" placeholder="내용 설명" rows="3"></textarea>
      </div>

      <!-- 버튼 -->
      <div class="fixed-actions">
        <button type="button" class="btn cancel-btn" @click="handleCancel">닫기</button>
        <button type="submit" :class="['btn', 'text-white', isExpense ? 'save-expense' : 'save-income']">
          저장
        </button>
      </div>
    </form>
    <div
      v-if="showCancelModal"
      class="modal fade show"
      tabindex="-1"
      role="dialog"
      style="display: block; background-color: rgba(0, 0, 0, 0.5); z-index: 1050;"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header text-white" style="background-color: #ff8a3d;">
            <h5 class="modal-title">입력 내용 확인</h5>
            <button type="button" class="btn-close" @click="cancelCancel"></button>
          </div>
          <div class="modal-body text-center">
            <p>입력한 내용이 저장되어 있지 않습니다.</p>
            <p class="text-danger">정말 나가시겠습니까?</p>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-secondary" @click="cancelCancel">취소</button>
            <button type="button" class="btn text-white" style="background-color: #ff8a3d;" @click="confirmCancel">
              확인
            </button>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>
  
  <script setup>
  import axios from 'axios';
  import { ref, computed } from 'vue';
  import '@/assets/addTrade.css';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user-store';
  import Alert from '@/components/Alert.vue';  

  const isExpense = ref(true); // true: 지출, false: 수입
  const date = ref(new Date().toISOString().slice(0, 10));
  const amount = ref(0);
  const paymentMethod = ref('');
  const category = ref('');
  const memo = ref('');
  const isFocused = ref(false);
  const router = useRouter();
  const userStore = useUserStore();
  const alertMessage = ref('');
  const alertType = ref('info');
  const showCancelModal = ref(false);
  const today = new Date().toISOString().slice(0, 10);

  
  const categoryOptions = computed(() => {
    return isExpense.value
      ? ['세금', '식비', '주거', '보건','오락','교통','통신','저축']
      : ['급여', '용돈', '상여금', '기타 수입'];
  });
  
  const handleSubmit = async () => {
  const newTradeId = Date.now().toString();
  const trade = {
    id: newTradeId,
    tradeId: newTradeId,
    tradeType: isExpense.value ? '지출' : '수입',
    tradeDate: date.value,
    tradeAmount: amount.value,
    tradeDescription: memo.value,
    userId: userStore.userId,
  };

  if (isExpense.value) {
    trade.expenseCategory = category.value;
    trade.tradeMethod = paymentMethod.value;
  } else {
    trade.incomeCategory = category.value;
  }

  try {
    await axios.post('/api/tradeList', trade);
    triggerAlert('거래 내역이 저장되었습니다!', 'success');
    setTimeout(() => router.push('/'), 2000);
  } catch (error) {
    console.error('저장 실패:', error);
    triggerAlert('저장에 실패했습니다.', 'danger');
  }
};

  const handleCancel = () => {
  showCancelModal.value = true;
};

const confirmCancel = () => {
  router.push('/');
};

const cancelCancel = () => {
  showCancelModal.value = false;
};



  const triggerAlert = (message, type = 'info') => {
  alertMessage.value = ''; // 먼저 리셋
  setTimeout(() => {
    alertMessage.value = message;
    alertType.value = type;
  }, 10); // 빠르게 갱신해서 알림 반응 트리거
};


  </script>
  