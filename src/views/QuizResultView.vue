<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="resultData">
      <h1 class="text-3xl font-bold text-green-600 mb-2">퀴즈 결과</h1>
      <h2 class="text-xl text-gray-600 mb-8">{{ resultData.category }} 카테고리</h2>
      
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-green-700">종합 점수</h3>
          <div class="text-4xl font-bold" :class="getScoreColorClass(resultData.score)">
            {{ resultData.score }}점
          </div>
        </div>
        
        <div class="h-4 bg-gray-200 rounded-full mb-6">
          <div 
            class="h-4 rounded-full" 
            :class="getScoreColorClass(resultData.score)"
            :style="{ width: `${resultData.score}%` }"
          ></div>
        </div>
        
        <div class="text-sm text-gray-500 text-right">
          정답률 기준 점수
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        <!-- 퀴즈 결과 -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-bold text-primary-700 mb-4">퀴즈 결과</h3>
          
          <div class="flex flex-col space-y-4">
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-gray-600">정답률</span>
                <span class="font-semibold" :class="getScoreColorClass(resultData.score)">
                  {{ resultData.score }}%
                </span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full">
                <div 
                  class="h-2 rounded-full" 
                  :class="getScoreColorClass(resultData.score)"
                  :style="{ width: `${resultData.score}%` }"
                ></div>
              </div>
            </div>
            
            <div class="flex justify-between">
              <div>
                <div class="text-gray-600 mb-1">맞은 문제</div>
                <div class="text-2xl font-semibold">
                  {{ resultData.correctCount }}/{{ resultData.totalQuestions }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 퀴즈 답변 세부 내용 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 class="text-xl font-bold text-primary-700 mb-4">퀴즈 상세 결과</h3>
        
        <div class="space-y-4">
          <div 
            v-for="(answer, index) in resultData.answers" 
            :key="index"
            class="p-4 rounded-lg"
            :class="answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'"
          >
            <div class="font-semibold mb-2">{{ index + 1 }}. {{ answer.question }}</div>
            
            <div class="flex flex-col space-y-2">
              <div class="flex items-start">
                <span class="text-gray-600 w-32">내 답변:</span>
                <span 
                  :class="answer.isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'"
                >
                  {{ answer.userAnswer }}
                </span>
              </div>
              
              <div v-if="!answer.isCorrect" class="flex items-start">
                <span class="text-gray-600 w-32">정답:</span>
                <span class="text-green-600 font-medium">{{ answer.correctAnswer }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-between">
        <router-link 
          :to="{ name: 'quiz-category-content', params: { categoryName: encodeURIComponent(resultData.category) } }" 
          class="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          다시 퀴즈 풀기
        </router-link>
        
        <router-link 
          to="/quiz/categories" 
          class="inline-block bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          다른 퀴즈 선택하기
        </router-link>
      </div>
    </div>
    
    <div v-else class="text-center py-16">
      <div class="text-2xl text-gray-500 mb-6">결과 데이터를 찾을 수 없습니다.</div>
      <router-link 
        to="/quiz/categories" 
        class="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md transition-colors"
      >
        퀴즈 선택하기
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const resultData = ref(null)

// 결과 로드
onMounted(() => {
  const storedResult = localStorage.getItem('quizResult');
  if (storedResult) {
    resultData.value = JSON.parse(storedResult);
  }
})

function getScoreColorClass(score) {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-primary-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-red-600'
}
</script>
