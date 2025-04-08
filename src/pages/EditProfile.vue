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
      <h2 class="text-center mb-4">회원 정보 수정</h2>
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
            required
          />
        </div>

        <button type="submit" class="btn w-100">수정하기</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseAlert from '@/components/BaseAlert.vue';
import { useUserStore } from '@/stores/user-store';
import axios from 'axios';

const userStore = useUserStore();

const router = useRouter();
const alertMessage = ref('');
const alertType = ref('info');

const userId = ref(userStore.userId);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const nickname = ref('');
const age = ref('');

const showAlert = (msg, type = 'info') => {
  alertMessage.value = msg;
  alertType.value = type;
};

// 사용자 정보 불러오기
const fetchUserInfo = async () => {
  try {
    console.log(userId.value);
    const response = await axios.get(
      `http://localhost:3000/users?userId=${userId.value}`
    );
    const user = response.data;
    email.value = user.email;
    nickname.value = user.nickname;
    age.value = user.age;
  } catch (error) {
    showAlert('사용자 정보를 불러오는 데 실패했습니다.', 'danger');
  }
};

// 사용자 정보 수정 처리
const handleUpdate = async () => {
  if (password.value && password.value !== confirmPassword.value) {
    showAlert('비밀번호가 일치하지 않습니다.', 'danger');
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
      `http://localhost:3000/users/${userId.value}`,
      updateData
    );
    showAlert('회원 정보가 성공적으로 수정되었습니다.', 'success');
    setTimeout(() => router.push('/'), 2000);
  } catch (error) {
    showAlert('회원 정보 수정 중 오류가 발생했습니다.', 'danger');
  }
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
