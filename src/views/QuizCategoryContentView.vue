<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary-600 mb-4">{{ decodedCategory }} 퀴즈 목록</h1>
    <p class="text-gray-600 mb-8">원하는 퀴즈을 선택하세요.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="quiz in filteredQuizs"
        :key="quiz.id"
        @click="selectQuiz(quiz.id)"
        class="bg-white rounded-lg shadow-lg p-6 border-2 border-primary-200 hover:border-primary-500 transition-colors cursor-pointer"
      >
        <h2 class="text-xl font-bold text-primary-700 mb-2">{{ quiz.title }}</h2>
        <p class="text-gray-600 mb-2">{{ quiz.question }}</p>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <router-link 
        to="/" 
        class="inline-block bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-2 rounded-md transition-colors"
      >
        홈으로 돌아가기
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import quizData from '@/data/quizData.json'

const route = useRoute()
const router = useRouter()

const categoryName = computed(() => route.params.categoryName || '')

const decodedCategory = computed(() => decodeURIComponent(categoryName.value))

const filteredQuizs = computed(() =>
  quizData.filter(quiz => quiz.category === decodedCategory.value)
)

function selectQuiz(contentId) {
  router.push({
    name: 'quiz-content',
    params: { contentId, categoryName: encodeURIComponent(categoryName) }
  })
}
</script>
