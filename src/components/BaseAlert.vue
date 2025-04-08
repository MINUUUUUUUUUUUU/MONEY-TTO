<template>
  <div
    v-if="visible"
    :class="[
      'alert-box',
      'alert',
      `alert-${type}`,
      'd-flex',
      'align-items-center',
      'fade',
      'show',
    ]"
    role="alert"
  >
    <i :class="iconClass" class="me-2 fs-4"></i>
    <div class="flex-grow-1 fs-5">{{ message }}</div>
    <button
      type="button"
      class="btn-close ms-3"
      @click="close"
      aria-label="Close"
    ></button>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'info',
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const visible = ref(true);

const close = () => {
  visible.value = false;
};

watch(
  () => props.message,
  () => {
    visible.value = true;
    if (props.duration > 0) {
      setTimeout(() => {
        close();
      }, props.duration);
    }
  }
);

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bi bi-check-circle-fill';
    case 'danger':
      return 'bi bi-exclamation-triangle-fill';
    case 'warning':
      return 'bi bi-exclamation-circle-fill';
    default:
      return 'bi bi-info-circle-fill';
  }
});
</script>

<style scoped>
.alert-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1050;
  width: 50%;
  max-width: 600px;
  min-width: 300px;
  min-height: 100px;
  padding: 1.5rem 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
