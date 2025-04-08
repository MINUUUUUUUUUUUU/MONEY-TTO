<style scoped>
* {
  transition: all 0.3s ease;
}

button {
  background-color: #ff8a3d;
  color: white;
}

button:hover {
  filter: brightness(1.2);
  color: white;
  background-color: #ff8a3d;
}
</style>

<template>
  <BaseAlert
    v-if="alertMessage"
    :message="alertMessage"
    :type="alertType"
    :duration="3000"
  />
  <div
    class="container min-vh-100 mb-5 d-flex justify-content-center align-items-center"
  >
    <div class="w-100 mt-5">
      <div class="text-center mb-4">
        <img
          src="https://placehold.co/300x300"
          alt="샘플이미지"
          class="img-fluid"
        />
      </div>
      <h2 class="text-center mb-4">회원가입</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label for="email" class="form-label">이메일</label>
          <div class="input-group">
            <input
              type="email"
              id="email"
              class="form-control"
              v-model="email"
              required
            />
            <button class="btn" type="button" @click="handleEmailCheck">
              중복 확인
            </button>
          </div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">비밀번호</label>
          <input
            type="password"
            id="password"
            class="form-control"
            v-model="password"
            required
          />
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            class="form-control"
            v-model="confirmPassword"
            required
          />
        </div>

        <div class="mb-3">
          <label for="nickname" class="form-label">닉네임</label>
          <input
            type="text"
            id="nickname"
            class="form-control"
            v-model="nickname"
            required
          />
        </div>

        <div class="mb-3">
          <label for="age" class="form-label">나이</label>
          <input
            type="number"
            id="age"
            class="form-control"
            v-model="userId"
            required
          />
        </div>

        <button type="submit" class="btn w-100">가입하기</button>
      </form>

      <div class="text-center mt-3">
        <router-link
          to="/login"
          class="text-decoration-underline text-secondary custom-link"
        >
          이미 계정이 있으신가요?
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { register, emailCheck } from '@/utils/auth-util.js';
import { useRouter } from 'vue-router';
import BaseAlert from '@/components/BaseAlert.vue';

const router = useRouter();

const alertMessage = ref('');
const alertType = ref('info');

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const nickname = ref('');
const userId = ref('');

const showAlert = (msg, type = 'info') => {
  alertMessage.value = msg;
  alertType.value = type;
};

const handleEmailCheck = async () => {
  const result = await emailCheck(email.value);
  showAlert(result.message);
};

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    showAlert('비밀번호가 일치하지 않습니다', 'danger');
    return;
  }

  const result = await register({
    email: email.value,
    password: password.value,
    nickname: nickname.value,
    age: age.value,
  });

  // 등록 처리 로직 (예: POST /users)
  showAlert(result.message, 'success');
  if (result.success === true) {
    router.push('/login');
  }
};
</script>
