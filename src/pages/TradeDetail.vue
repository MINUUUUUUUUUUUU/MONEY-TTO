<template>
  <div class="container py-4" style="padding: 2rem 3rem;">
    <!-- 제목 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="fw-bold" style="margin-top: 1.5rem;">
        <img src="@/assets/money_hand.png" alt="아이콘" width="45" height="45" class="me-2" />
        {{ trade.tradeType }} 상세 내역
      </h4>
    </div>

    <!-- 금액 -->
    <h2 :class="['fw-bold', trade.tradeType === '지출' ? 'text-warning' : 'text-success']">
      {{ trade.tradeType === '지출' ? '-' : '+' }} {{ formattedAmount }} 원
    </h2>

    <hr />

    <!-- 거래 정보 -->
    <div class="row">
      <span class="label">일자&nbsp;|</span>
      <span class="value">{{ trade.tradeDate }}</span>
    </div>

  <div class="row">
      <span class="label">카테고리&nbsp;|</span>
      <span class="value">{{ category }}</span>
  </div>
  <div class="row" v-if="trade.tradeType === '지출'">
      <span class="label">결제수단&nbsp;|</span>
      <span class="value">{{ trade.tradeMethod }}</span>
  </div>
  <div class="row">
  <span class="label">메모&nbsp;|</span>
  <span class="value" v-if="trade.tradeDescription && trade.tradeDescription.trim()">
    {{ trade.tradeDescription }}
  </span>
  <span class="value text-secondary" v-else>내용 없음</span>
</div>




    <!-- 버튼 -->
    <div class="d-flex justify-content-between mt-4">
      <!-- 버튼 -->
<div class="fixed-actions-detail">
  <button class="btn btn-orange" @click="goToEdit">수정</button>
  <button class="btn btn-gray" @click="handleDelete">삭제</button>
</div>

    </div>

    <!-- 삭제 확인 모달 -->
    <div
      class="modal fade show"
      tabindex="-1"
      role="dialog"
      style="display: block; background-color: rgba(0, 0, 0, 0.5);"
      v-if="showModal"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header text-white" style="background-color: #ff8a3d;">
            <h5 class="modal-title">거래 내역 삭제</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body text-center">
            <p>이 거래 내역을 삭제하시겠습니까?</p>
            <p class="text-danger">삭제한 내용은 복구할 수 없습니다.</p>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-secondary" @click="showModal = false">취소</button>
            <button type="button" class="btn text-white" style="background-color: #ff8a3d;" @click="confirmDelete">
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import '@/assets/tradeDetail.css'

const route = useRoute();
const router = useRouter();
const trade = ref({});
const category = ref('-');
const showModal = ref(false);
const id = String(route.params.id);


const formattedAmount = computed(() =>
  Number(trade.value.tradeAmount || 0).toLocaleString()
);

// 거래 상세 조회 (id 기준)
const fetchTrade = async () => {
  try {
    const res = await axios.get(`https://money-tto.glitch.me/tradeList/${id}`);
    trade.value = res.data;

    const categoryType = trade.value.tradeType === '수입' ? 'incomeCategory' : 'expenseCategory';
    const categoryId = trade.value.incomeCategory || trade.value.expenseCategory;

    const categoryRes = await axios.get(`https://money-tto.glitch.me/${categoryType}`);
    const found = categoryRes.data.find(
  c => String(c.id) === String(categoryId) || c.category === categoryId
);

    category.value = found?.category || '-';
  } catch (err) {
    console.error('[조회 오류]', err);
    alert('해당 거래 내역을 불러올 수 없습니다.');
    router.push('/');
  }
};

const goToEdit = () => {
  router.push(`/trade/${id}/edit`);
};

const handleDelete = () => {
  showModal.value = true;
};

const confirmDelete = async () => {
  try {
await axios.delete(`https://money-tto.glitch.me/tradeList/${id}`);    alert('삭제되었습니다!');
    showModal.value = false;
    router.push('/trade');
  } catch (err) {
    console.error('[삭제 오류]', err);
    alert('삭제 중 오류가 발생했습니다.');
  }
};

onMounted(fetchTrade);
</script>
