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
  <div
    class="container d-flex justify-content-center align-items-center"
    style="min-height: 100vh"
  >
    <div class="w-100" style="max-width: 500px">
      <div class="text-center mb-4">
        <img
          src="https://placehold.co/300x300"
          alt="샘플이미지"
          class="img-fluid"
        />
      </div>
      <h2 class="text-center mb-4" @submit.prevent="handleRegister">
        회원가입
      </h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label for="email" class="form-label">이메일</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            required
          />
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
            type="text"
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
import { register } from '@/utils/auth-util.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const nickname = ref('');
const userId = ref('');

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  const result = register({
    email: email.value,
    password: password.value,
    nickname: nickname.value,
    age: age.value,
    userId: userId.value,
  });

  // 등록 처리 로직 (예: POST /users)
  alert('회원가입 완료!');
  router.push('/login');
};
</script>
