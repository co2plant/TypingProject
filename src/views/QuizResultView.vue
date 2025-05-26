<template>
  <div class="max-w-3xl mx-auto my-8 px-4">
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- 헤더 -->
      <div class="py-8 px-6 text-center border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">퀴즈 결과</h2>
        <p class="text-gray-600 mt-1">{{ category }} 카테고리</p>
      </div>
      
      <!-- 결과 요약 -->
      <div class="p-6 text-center">
        <div class="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6"
             :class="resultBackgroundClass">
          <span class="text-3xl font-bold" :class="resultTextClass">{{ percentage }}%</span>
        </div>
        
        <h3 class="text-xl font-bold text-gray-800 mb-2">{{ resultTitle }}</h3>
        <p class="text-gray-600 mb-6">{{ resultMessage }}</p>
        
        <div class="flex justify-center gap-2 text-lg font-medium">
          <span class="text-gray-600">총 문제:</span>
          <span class="text-gray-800">{{ total }}개</span>
          <span class="mx-2 text-gray-400">|</span>
          <span class="text-gray-600">정답:</span>
          <span class="text-primary-600">{{ correct }}개</span>
        </div>
      </div>
      
      <!-- 분석 -->
      <div class="px-6 pb-6">
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">학습 조언</h3>
          
          <p class="text-gray-700 leading-relaxed mb-3">
            {{ studyAdvice }}
          </p>
          
          <p class="text-gray-700 leading-relaxed" v-if="percentage < 70">
            더 많은 연습이 필요합니다. 타이핑 연습을 통해 개념을 익히고 다시 도전해보세요.
          </p>
          <p class="text-gray-700 leading-relaxed" v-else>
            훌륭한 결과입니다! 다른 카테고리도 도전해보세요.
          </p>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 쿼리 파라미터에서 결과 데이터 가져오기
const category = ref('')
const total = ref(0)
const correct = ref(0)

// 결과 로드
onMounted(() => {
  category.value = route.query.category || '알 수 없음'
  total.value = parseInt(route.query.total || 0)
  correct.value = parseInt(route.query.correct || 0)
})

// 정답률 계산
const percentage = computed(() => {
  if (total.value === 0) return 0
  return Math.round((correct.value / total.value) * 100)
})

// 결과에 따른 타이틀
const resultTitle = computed(() => {
  if (percentage.value < 30) return '아직 부족해요'
  if (percentage.value < 60) return '조금 더 노력하세요'
  if (percentage.value < 85) return '잘 했어요!'
  return '훌륭합니다!'
})

// 결과 메시지
const resultMessage = computed(() => {
  if (percentage.value < 50) {
    return '더 많은 연습이 필요합니다. 기본 개념부터 다시 학습해보세요.'
  } else if (percentage.value < 70) {
    return '괜찮은 결과입니다만, 더 향상될 수 있습니다.'
  } else if (percentage.value < 90) {
    return '훌륭한 결과입니다! 조금만 더 완벽해질 수 있어요.'
  } else {
    return '놀라운 성적입니다! 이 주제를 완벽하게 이해하고 있군요.'
  }
})

// 학습 조언
const studyAdvice = computed(() => {
  switch (category.value) {
    case '컴퓨터 과학':
      return '컴퓨터 과학의 기본 개념을 더 깊게 이해하기 위해 관련 알고리즘과 데이터 구조에 집중해보세요.'
    case '네트워크':
      return '네트워크 프로토콜의 작동 원리와 OSI 7계층 모델을 더 자세히 학습하면 도움이 됩니다.'
    case '프로그래밍':
      return '프로그래밍 패러다임과 다양한 언어의 특징을 비교해보면 이해도를 높일 수 있습니다.'
    default:
      return '이론과 실습을 병행하여 학습하면 더 효과적입니다.'
  }
})

// 결과에 따른 배경색 클래스
const resultBackgroundClass = computed(() => {
  if (percentage.value < 50) return 'bg-red-50'
  if (percentage.value < 70) return 'bg-amber-50'
  if (percentage.value < 90) return 'bg-green-50'
  return 'bg-primary-50'
})

// 결과에 따른 텍스트 색상 클래스
const resultTextClass = computed(() => {
  if (percentage.value < 50) return 'text-red-500'
  if (percentage.value < 70) return 'text-amber-500'
  if (percentage.value < 90) return 'text-green-500'
  return 'text-primary-600'
})

// 다시 풀기
const retryQuiz = () => {
  router.push({
    name: 'quiz',
    params: { category: encodeURIComponent(category.value) }
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
