<template>
  <div class="container">
    <div class="d-flex flex-column">
      <div class="align-items-center">
        <img src="https://placehold.co/300x300" alt="샘플이미지" />
      </div>

      <br />
      <div class="col-md-6">
        <label for="email"><i class="fa-solid fa-user"></i> 사용자 ID:</label>
        <input id="email" class="form-control mt-3 mb-3 rounded" />
        <label for="password"><i class="fa-solid fa-lock"></i> 비밀번호:</label>
        <input id="password" class="form-control mb-3 rounded" />
        <div class="d-grid gap-3">
          <button type="button" class="btn" @click="handleLogin">
            <i class="fa-solid fa-right-to-bracket"></i> 로그인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
button {
  background-color: #ff8a3d;
  color: white;
}

button:hover {
  filter: brightness(0.8);
  color: white;
  background-color: #ff8a3d;
}
</style>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/utils/auth-util.js';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  const result = await login(email.value, password.value);
  if (result.success) {
    router.push('/');
  } else {
    alert('로그인 실패: ' + result.message);
  }
};
</script>
