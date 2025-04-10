<template>
  <div class="mt-5">
    <!-- 월별 소비 분석 -->
    <section class="analysis-section mb-4">
      <h5 class="analysis-title">📆 월별 소비 분석</h5>
      <div class="card p-4 border-0 shadow-sm rounded-4 bg-white">
        <MonthAnalysis />
      </div>
    </section>

    <!-- 카테고리 별 소비 분석 -->
    <section class="analysis-section mb-4">
      <h5 class="analysis-title">🗂️ 카테고리별 소비 분석</h5>
      <div class="card p-4 border-0 shadow-sm rounded-4 bg-white">
        <CategoryAnalysis />
      </div>
    </section>
  </div>
</template>

<script setup>
import CategoryAnalysis from '@/components/CategoryAnalysis.vue';
import MonthAnalysis from '@/components/MonthAnalysis.vue';
</script>

<style scoped>
.analysis-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #495057;
  margin-bottom: 0.75rem;
  padding-left: 0.25rem;
}

.analysis-section {
  padding: 0 0.5rem;
}
</style>
