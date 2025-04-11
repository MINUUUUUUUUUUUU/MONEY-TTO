<template>
  <div
  class="container d-flex justify-content-center align-items-center"
  style="height: 80vh; overflow: hidden;"
>

    <Alert v-if="alertMessage" :message="alertMessage" :type="alertType" />
    <div class="w-100 mt-5">
      <h2 class="text-center mb-4">회원 정보 수정</h2>
      <p v-if="nickname" class="text-center mb-4">
        {{ nickname }} 님, 안녕하세요.
      </p>
      <form @submit.prevent="handleUpdate">
        <div class="mb-3">
          <label for="email" class="form-label">이메일</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            readonly
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">새 비밀번호</label>
          <input
            type="password"
            id="password"
            class="form-control"
            v-model="password"
          />
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            class="form-control"
            v-model="confirmPassword"
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
            v-model="age"
            min="1"
            max="120"
            required
          />
        </div>

        <div class="d-flex gap-2">
          <router-link to="/" class="btn btn-secondary w-50">취소</router-link>
          <button type="submit" class="btn w-50">수정하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user-store';
import Alert from '@/components/Alert.vue';
import axios from 'axios';

const userStore = useUserStore();

const router = useRouter();
const alertMessage = ref('');
const alertType = ref('info');

const id = ref('');
const userIndex = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const nickname = ref('');
const age = ref('');

// 사용자 정보 불러오기
const fetchUserInfo = async () => {
  try {
    userIndex.value = userStore.userIndex;

    const response = await axios.get(
      `https://money-tto.glitch.me/users?userIndex=${userIndex.value}`
    );

    const user = response.data[0]; // 배열에서 첫 번째 사용자 정보 추출

    if (!user) {
      triggerAlert('사용자 정보를 찾을 수 없습니다.', 'danger');
      return;
    }

    id.value = user.id;
    email.value = user.email;
    nickname.value = user.nickname;
    age.value = user.age;
    password.value = '';
    confirmPassword.value = '';
  } catch (error) {
    triggerAlert('사용자 정보를 불러오는 데 실패했습니다.', 'danger');
  }
};

// 사용자 정보 수정 처리
const handleUpdate = async () => {
  if (password.value && password.value !== confirmPassword.value) {
    triggerAlert('비밀번호가 일치하지 않습니다.', 'danger');
    return;
  }

  try {
    const updateData = {
      nickname: nickname.value,
      age: age.value,
    };

    if (password.value) {
      updateData.password = password.value;
    }

    await axios.patch(
      `https://money-tto.glitch.me/users/${id.value}`,
      updateData
    );
    triggerAlert('회원 정보가 성공적으로 수정되었습니다.', 'success');
    setTimeout(() => router.push('/'), 2000);
  } catch (error) {
    triggerAlert('회원 정보 수정 중 오류가 발생했습니다.', 'danger');
  }
};

const triggerAlert = (message, type) => {
  alertMessage.value = ''; // 리셋
  setTimeout(() => {
    alertMessage.value = message;
    alertType.value = type;
  }, 300); // 아주 짧은 지연 후 다시 설정
};

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push('/login');
  } else {
    fetchUserInfo();
  }
});
</script>

<style scoped>
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
