<template>
  <div
    v-if="visible"
    :class="[
      'alert',
      `alert-${type}`,
      'text-center',
      'position-fixed',
      'top-50',
      'start-50',
      'translate-middle',
      'shadow',
      'px-4',
      'py-3',
    ]"
    role="alert"
    style="z-index: 1050; min-width: 300px; max-width: 500px"
  >
    <strong>{{ message }}</strong>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'info', // info, success, danger, warning
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const visible = ref(false);

watch(
  () => props.message,
  () => {
    if (props.message) {
      visible.value = true;
      if (props.duration > 0) {
        setTimeout(() => (visible.value = false), props.duration);
      }
    }
  },
  { immediate: true }
);
</script>
