<template>
  <div class="max-w-3xl mx-auto my-8 px-4">
    <div v-if="resultData" class="bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- 헤더 -->
      <div class="py-8 px-6 text-center border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">퀴즈 결과</h2>
        <p class="text-gray-600 mt-1">{{ resultData.category }} 카테고리</p>
      </div>
      
      <!-- 결과 요약 -->
      <div class="p-6 text-center">
        <div class="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6"
             :class="resultBackgroundClass">
          <span class="text-3xl font-bold" :class="resultTextClass">{{ resultData.score }}%</span>
        </div>
        
        <h3 class="text-xl font-bold text-gray-800 mb-2">{{ resultTitle }}</h3>
        <p class="text-gray-600 mb-6">{{ resultMessage }}</p>
        
        <div class="flex justify-center gap-2 text-lg font-medium">
          <span class="text-gray-600">총 문제:</span>
          <span class="text-gray-800">{{ resultData.totalQuestions }}개</span>
          <span class="mx-2 text-gray-400">|</span>
          <span class="text-gray-600">정답:</span>
          <span class="text-primary-600">{{ resultData.correctCount }}개</span>
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
      
      <!-- 버튼 그룹 -->
      <div class="flex flex-col sm:flex-row justify-between gap-4 px-6 pb-6">
        <button 
          @click="retryQuiz" 
          class="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-primary-500 text-primary-600 hover:bg-primary-50 font-medium rounded-lg transition-colors"
        >
          <span>🔄</span> 다시 풀기
        </button>
        
        <button
          @click="selectAnotherCategory" 
          class="flex items-center justify-center gap-2 px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          <span>📚</span> 다른 카테고리 선택
        </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const resultData = ref(null)

// 결과 로드
onMounted(() => {
  const storedResult = localStorage.getItem('quizResult');
  if (storedResult) {
    resultData.value = JSON.parse(storedResult);
  }
})

// 결과에 따른 타이틀
const resultTitle = computed(() => {
  if (!resultData.value) return ''
  const score = resultData.value.score
  if (score < 30) return '아직 부족해요'
  if (score < 60) return '조금 더 노력하세요'
  if (score < 85) return '잘 했어요!'
  return '훌륭합니다!'
})

// 결과 메시지
const resultMessage = computed(() => {
  if (!resultData.value) return ''
  const score = resultData.value.score
  if (score < 50) {
    return '더 많은 연습이 필요합니다. 기본 개념부터 다시 학습해보세요.'
  } else if (score < 70) {
    return '괜찮은 결과입니다만, 더 향상될 수 있습니다.'
  } else if (score < 90) {
    return '훌륭한 결과입니다! 조금만 더 완벽해질 수 있어요.'
  } else {
    return '놀라운 성적입니다! 이 주제를 완벽하게 이해하고 있군요.'
  }
})

// 결과에 따른 배경색 클래스
const resultBackgroundClass = computed(() => {
  if (!resultData.value) return ''
  const score = resultData.value.score
  if (score < 50) return 'bg-red-50'
  if (score < 70) return 'bg-amber-50'
  if (score < 90) return 'bg-green-50'
  return 'bg-primary-50'
})

// 결과에 따른 텍스트 색상 클래스
const resultTextClass = computed(() => {
  if (!resultData.value) return ''
  const score = resultData.value.score
  if (score < 50) return 'text-red-500'
  if (score < 70) return 'text-amber-500'
  if (score < 90) return 'text-green-500'
  return 'text-primary-600'
})

// 다시 풀기
const retryQuiz = () => {
  if (!resultData.value) return;
  router.push({
    name: 'quiz',
    params: { categoryName: encodeURIComponent(resultData.value.category) }
  })
}

// 다른 카테고리 선택
const selectAnotherCategory = () => {
  router.push({ name: 'quiz-category-selection' })
}
</script>

<style scoped>
/* Tailwind CSS로 스타일링 */
</style>
