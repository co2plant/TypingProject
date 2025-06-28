<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-primary-700 mb-4">개발자를 위한 타자 연습</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">타자 속도와 정확도를 향상시키면서 기술 개념도 함께 익히는 인터랙티브 학습 플랫폼</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" @click="goToCategorySelection()">
        <div class="text-5xl mb-4 text-center">⌨️</div>
        <h3 class="text-xl font-semibold text-primary-600 mb-2 text-center">타자 연습</h3>
        <p class="text-gray-600 text-center">다양한 기술 콘텐츠로 타자 실력을 향상시키세요</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" @click="goToQuizCategorySelection()">
        <div class="text-5xl mb-4 text-center">⏱️</div>
        <h3 class="text-xl font-semibold text-primary-600 mb-2 text-center">퀴즈</h3>
        <p class="text-gray-600 text-center">배운 기술 개념을 퀴즈로 검증해보세요</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" @click="goToExamCategorySelection()">
        <div class="text-5xl mb-4 text-center">🎓</div>
        <h3 class="text-xl font-semibold text-primary-600 mb-2 text-center">시험</h3>
        <p class="text-gray-600 text-center">타자 연습과 퀴즈가 결합된 종합 시험에 도전해보세요</p>
      </div>
    </div>
    
    <div class="text-center mt-8">
      <router-link 
        to="/admin"
        class="text-gray-500 hover:text-gray-700 text-sm underline"
      >
        관리자 페이지
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToCategorySelection = () => {
  router.push({ name: 'practice-category-list' })
}

const goToQuizCategorySelection = () => {
  router.push({ name: 'quiz-category-list' })
}

const goToExamCategorySelection = () => {
  router.push({ name: 'exam-category-list' })
}
</script>
<style scoped>
</style>


