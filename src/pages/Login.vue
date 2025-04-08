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

a {
  text-decoration-color: #6c757d;
}
</style>
<template>
  <div
    class="container min-vh-100 d-flex justify-content-center align-items-center"
  >
    <div class="row justify-content-center w-100">
      <div class="col-8">
        <div class="text-center mb-4">
          <img
            src="https://placehold.co/300x300"
            alt="샘플이미지"
            class="img-fluid"
          />
        </div>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">
              <i class="fa-solid fa-user"></i> 이메일
            </label>
            <input
              id="email"
              type="email"
              class="form-control"
              v-model="email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">
              <i class="fa-solid fa-lock"></i> 비밀번호
            </label>
            <input
              id="password"
              type="password"
              class="form-control"
              v-model="password"
              required
            />
          </div>
          <div class="d-grid">
            <button type="submit" class="btn">
              <i class="fa-solid fa-right-to-bracket"></i> 로그인
            </button>
          </div>
          <div class="mt-5 text-center">
            <router-link to="/register" class="btn btn-link">
              <p class="text-secondary">회원이 아니신가요?</p>
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/utils/auth-util.js';
import { useUserStore } from '@/stores/user-store';

const email = ref('');
const password = ref('');
const router = useRouter();
const userStore = useUserStore();

const handleLogin = async () => {
  const result = await login(email.value, password.value);
  console.log(result);

  if (result.success) {
    userStore.userId = result.userId;
    await router.push('/');
  } else {
    alert('로그인 실패: ' + result.message);
  }
};
</script>
