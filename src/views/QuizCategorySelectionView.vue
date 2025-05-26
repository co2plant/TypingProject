<template>
  <div class="max-w-3xl mx-auto my-8 px-4">
    <div class="bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">문제 풀이 카테고리 선택</h1>
      
      <p class="text-gray-600 text-center mb-8">
        타이핑 연습을 통해 학습한 내용을 확인하기 위한 문제를 풀어보세요.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="category in categories" 
          :key="category"
          @click="selectCategory(category)"
          class="bg-gray-50 p-6 rounded-xl border border-gray-200 cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ category }}</h3>
          <p class="text-sm text-gray-600">{{ getCategoryDescription(category) }}</p>
          <div class="flex justify-between items-center mt-4">
            <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
              {{ getCategoryQuestionCount(category) }}개의 문제
            </span>
            <span class="text-primary-600">&rarr;</span>
          </div>
        </div>
      </div>
      
      <div class="mt-8 flex justify-center">
        <button 
          @click="goHome"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-1 transition-colors"
        >
          <span>&larr;</span> 홈으로 돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import quizData from '@/data/quizData.json'

const router = useRouter()

// 고유한 카테고리 리스트 추출
const categories = computed(() => {
  const uniqueCategories = new Set()
  quizData.forEach(quiz => uniqueCategories.add(quiz.category))
  return Array.from(uniqueCategories)
})

// 카테고리별 설명 (실제로는 DB나 별도 데이터에서 가져올 수 있음)
const getCategoryDescription = (category) => {
  const descriptions = {
    '컴퓨터 과학': '컴퓨터 과학의 기본 개념과 이론에 관한 문제',
    '네트워크': '네트워크 프로토콜, 아키텍처 및 주요 개념에 관한 문제',
    '프로그래밍': '다양한 프로그래밍 언어와 개념에 관한 문제',
    '자격증': '정보처리기사 등 IT 자격증 준비를 위한 문제'
  }
  return descriptions[category] || `${category} 관련 문제`
}

// 카테고리별 문제 개수
const getCategoryQuestionCount = (category) => {
  return quizData.filter(quiz => quiz.category === category).length
}

// 카테고리 선택 시 해당 퀴즈 페이지로 이동
const selectCategory = (category) => {
  router.push({
    name: 'quiz',
    params: { category: encodeURIComponent(category) }
  })
}

// 홈으로 돌아가기
const goHome = () => {
  router.push({ name: 'home' })
}
</script>

<style scoped>
/* Tailwind CSS로 스타일링 */
</style>
