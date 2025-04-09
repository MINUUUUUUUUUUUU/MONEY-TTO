<template>
  <!-- 전체 컨테이너를 감싸는 div -->
  <div class="container">
    <!-- 헤더 컴포넌트를 표시 -->
    <Header />

    <Alert v-if="alertMessage" :message="alertMessage" :type="alertType" />
    <button @click="triggerAlert" class="btn btn-success">성공 메시지</button>

    <!-- 라우터에 의해 매칭되는 컴포넌트를 표시하는 영역 -->
    <!-- 클릭된 RouterLink에 따라 표시되는 컴포넌트가 변경됨 -->
    <RouterView />
  </div>
</template>

<script setup>
import Alert from './components/Alert.vue';
import Header from './components/Header.vue';

import { ref } from 'vue';

const alertMessage = ref('');
const alertType = ref('info');

const triggerAlert = () => {
  alertMessage.value = ''; // 리셋
  setTimeout(() => {
    alertMessage.value = '성공이여~';
    alertType.value = 'success';
  }, 300); // 아주 짧은 지연 후 다시 설정
};
</script>
