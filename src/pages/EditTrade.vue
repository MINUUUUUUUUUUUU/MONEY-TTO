<template>
  <div class="container mt-4">
    <Alert
      v-if="alertMessage"
      :message="alertMessage"
      :type="alertType"
      :duration="2000"
    />

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
        <input
          type="date"
          class="form-control"
          v-model="date"
          :max="today"
          required
        />
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
            {{ isExpense ? "−" : "+" }}
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

    <!-- 수정 취소 모달 -->
    <div
      v-if="showCancelModal"
      class="modal fade show"
      tabindex="-1"
      role="dialog"
      style="
        display: block;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1050;
      "
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div
            class="modal-header text-white"
            style="background-color: #ff8a3d"
          >
            <h5 class="modal-title">수정 취소</h5>
            <button
              type="button"
              class="btn-close"
              @click="cancelCancel"
            ></button>
          </div>
          <div class="modal-body text-center">
            <p>수정한 내용이 저장되지 않습니다.</p>
            <p class="text-danger">정말 나가시겠습니까?</p>
          </div>
          <div class="modal-footer justify-content-center">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelCancel"
            >
              취소
            </button>
            <button
              type="button"
              class="btn text-white"
              style="background-color: #ff8a3d"
              @click="confirmCancel"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import "@/assets/addTrade.css";
import Alert from "@/components/Alert.vue";
import { useUserStore } from "@/stores/user-store";

const route = useRoute();
const router = useRouter();
const id = String(route.params.id); // 거래 ID
const userStore = useUserStore();

const isExpense = ref(true);
const date = ref("");
const amount = ref(0);
const paymentMethod = ref("");
const category = ref("");
const memo = ref("");
const isFocused = ref(false);
const showCancelModal = ref(false);

const alertMessage = ref("");
const alertType = ref("info");
const today = new Date().toISOString().slice(0, 10);

const categoryOptions = computed(() => {
  return isExpense.value
    ? ["세금", "식비", "주거", "보건", "오락", "교통", "통신", "저축"]
    : ["급여", "용돈", "상여금", "기타 수입"];
});

// 거래 정보 불러오기
const fetchTrade = async () => {
  try {
    const res = await axios.get(`https://money-tto.glitch.me/tradeList/${id}`);
    const trade = res.data;

    isExpense.value = trade.tradeType === "지출";
    date.value = trade.tradeDate;
    amount.value = trade.tradeAmount;
    memo.value = trade.tradeDescription;

    if (isExpense.value) {
      paymentMethod.value = trade.tradeMethod;
      const categoryRes = await axios.get(
        "https://money-tto.glitch.me/expenseCategory"
      );
      const found = categoryRes.data.find(
        (c) =>
          String(c.id) === String(trade.expenseCategory) ||
          c.category === trade.expenseCategory
      );
      category.value = found?.category || trade.expenseCategory;
    } else {
      const categoryRes = await axios.get(
        "https://money-tto.glitch.me/incomeCategory"
      );
      const found = categoryRes.data.find(
        (c) =>
          String(c.id) === String(trade.incomeCategory) ||
          c.category === trade.incomeCategory
      );
      category.value = found?.category || trade.incomeCategory;
    }
  } catch (err) {
    console.error("[조회 오류]", err);
    alert("거래 내역을 불러올 수 없습니다.");
    router.push("/");
  }
};

// 거래 수정 제출
const handleSubmit = async () => {
  const trade = {
    id,
    tradeId: id,
    tradeType: isExpense.value ? "지출" : "수입",
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
    await axios.put(`https://money-tto.glitch.me/tradeList/${id}`, trade);
    triggerAlert("거래 내역이 수정되었습니다!", "success");
    setTimeout(() => router.push(`/trade/${id}`), 2000);
  } catch (err) {
    console.error("[수정 실패]", err);
    triggerAlert("수정에 실패했습니다.", "danger");
  }
};

const handleCancel = () => {
  showCancelModal.value = true;
};

const confirmCancel = () => {
  router.push(`/trade/${id}`);
};

const cancelCancel = () => {
  showCancelModal.value = false;
};

const triggerAlert = (message, type = "info") => {
  alertMessage.value = "";
  setTimeout(() => {
    alertMessage.value = message;
    alertType.value = type;
  }, 10);
};

const handleTabClick = (targetIsExpense) => {
  if (targetIsExpense !== isExpense.value) {
    triggerAlert(
      `현재 '${
        isExpense.value ? "지출" : "수입"
      }' 내역을 수정 중입니다.\n다른 탭으로 전환할 수 없습니다.`,
      "warning"
    );
    return;
  }
};

onMounted(fetchTrade);
</script>
