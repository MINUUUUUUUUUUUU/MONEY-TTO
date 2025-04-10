<style scoped>
* {
  transition: all 0.1s ease;
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

img {
  max-height: 300px;
}

a {
  text-decoration-color: #6c757d;
}

.m {
  margin-top: 10%;
}
</style>

<template>
  <div class="container m">
    <Alert v-if="alertMessage" :message="alertMessage" :type="alertType" />
    <div class="row">
      <!-- 로고 이미지 섹션 -->
      <div
        class="col-md-6 d-flex justify-content-center justify-content-md-end"
      >
        <img src="@/assets/logo.png" alt="로고" class="img-fluid" />
        <!-- <Carousel /> -->
      </div>
      <!-- 폼 섹션 -->
      <div class="col-md-6">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-8">
            <Alert
              v-if="alertMessage"
              :message="alertMessage"
              :type="alertType"
            />
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/utils/auth-util.js';
import Alert from '@/components/Alert.vue';
import { useUserStore } from '@/stores/user-store';

const email = ref('');
const password = ref('');
const router = useRouter();
const userStore = useUserStore();

const alertMessage = ref('');
const alertType = ref('info');

const handleLogin = async () => {
  const result = await login(email.value, password.value);
  console.log(result);

  if (result.success) {
    userStore.userId = result.userId;
    await router.push('/');
  } else {
    triggerAlert(result.message, 'danger');
  }
};

const triggerAlert = (message, type) => {
  alertMessage.value = ''; // 리셋
  setTimeout(() => {
    alertMessage.value = message;
    alertType.value = type;
  }, 300); // 아주 짧은 지연 후 다시 설정
};
</script>
