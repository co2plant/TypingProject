<template>
  <div class="max-w-3xl mx-auto my-8 px-4">
        <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">학습 카테고리 선택</h1>
        
        <p class="text-gray-600 text-center mb-8">
            실전을 경험해볼 차례입니다.
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
                {{ getCategoryQuestionCount(category) }}개의 시험
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import examData from '@/data/examData.json';
import categoryData from '@/data/categoryData.json';

const router = useRouter();

const categories = computed(() => {
  const uniqueCategories = new Set(examData.map(exam => exam.category));
  return Array.from(uniqueCategories);
})

const getCategoryDescription = (category) => {
  const descriptions = JSON.parse(JSON.stringify(categoryData))
  return descriptions[category] || `${category} 관련 문제`
}

const selectCategory = (categoryName) => {
    router.push({ name: 'exam-category-content', params: { categoryName: encodeURIComponent(categoryName) } })
}

const getCategoryQuestionCount = (category) => {
  return examData.filter(contents => contents.category === category).length
}

const goHome = () => {
  router.push({ name: 'home' })
}
</script>
