<template>
  <div class="max-w-3xl mx-auto my-8 px-4">
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="py-8 px-6 text-center border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">타자 연습 결과</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div class="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
          <div class="text-3xl mb-2">⚡</div>
          <div class="text-2xl font-bold text-gray-800 mb-1">{{ results.wpm }} WPM</div>
          <div :class="{
            'text-amber-500': speedRating.label === '초보',
            'text-green-500': speedRating.label === '평균' || speedRating.label === '양호',
            'text-green-500': speedRating.label === '빠름',
            'text-purple-600': speedRating.label === '전문가'
          }" class="font-medium">
            {{ speedRating.label }}
          </div>
        </div>
        
        <div class="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
          <div class="text-3xl mb-2">✓</div>
          <div class="text-2xl font-bold text-gray-800 mb-1">{{ results.accuracy }}%</div>
          <div :class="{
            'text-amber-500': accuracyRating.label === '개선 필요',
            'text-green-500': accuracyRating.label === '양호' || accuracyRating.label === '매우 좋음',
            'text-green-500': accuracyRating.label === '우수'
          }" class="font-medium">
            {{ accuracyRating.label }}
          </div>
        </div>
        
        <div class="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
          <div class="text-3xl mb-2">⏱️</div>
          <div class="text-2xl font-bold text-gray-800 mb-1">{{ results.time.toFixed(1) }}초</div>
          <div class="text-gray-600 font-medium">총 시간</div>
        </div>
      </div>
      
      <div class="mx-6 mb-6 p-6 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">성능 분석</h3>
        <p class="mb-3 text-gray-700 leading-relaxed">
          당신은 <span class="font-semibold text-green-600">{{ results.wpm }} 분당 단어</span>의 속도로 타자를 쳤으며, 
          정확도는 <span class="font-semibold text-green-600">{{ results.accuracy }}%</span> 입니다.
        </p>
        <p class="text-gray-700 leading-relaxed">{{ performanceMessage }}</p>
      </div>
      
      <div class="flex flex-col md:flex-row justify-between gap-4 px-6 pb-6">
        <button 
          @click="goHome"
          class="flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
        >
          <span>🏠</span> 홈으로
        </button>
        <button
          @click="tryAgain" 
          class="flex items-center justify-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
        >
          <span>🔄</span> 다시 시도
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const results = ref({
  wpm: 0,
  accuracy: 0,
  time: 0
})

onMounted(() => {
  results.value = {
    wpm: Number(route.query.wpm || 0),
    accuracy: Number(route.query.accuracy || 0),
    time: Number(route.query.time || 0)
  }
})

const speedRating = computed(() => {
  const wpm = results.value.wpm
  if (wpm < 30) return { label: '초보', color: '#ff9800' }
  if (wpm < 50) return { label: '평균', color: '#4caf50' }
  if (wpm < 70) return { label: '양호', color: '#4caf50' }
  if (wpm < 90) return { label: '빠름', color: '#22c55e' }
  return { label: '전문가', color: '#15803d' }
})

const accuracyRating = computed(() => {
  const accuracy = results.value.accuracy
  if (accuracy < 80) return { label: '개선 필요', color: '#ff9800' }
  if (accuracy < 90) return { label: '양호', color: '#4caf50' }
  if (accuracy < 97) return { label: '매우 좋음', color: '#4caf50' }
  return { label: '우수', color: '#22c55e' }
})

const performanceMessage = computed(() => {
  const { wpm, accuracy } = results.value
  let message = ''
  
  if (wpm < 40) {
    message += '타자 속도를 향상시키기 위해 계속 연습하세요! '
  } else {
    message += '훌륭합니다! 당신의 타자 속도는 평균 이상입니다. '
  }
  
  if (accuracy < 90) {
    message += '오류를 줄이기 위해 정확도에 집중하세요.'
  } else {
    message += '당신의 정확도는 우수합니다!'
  }
  
  return message
})

// 홈으로 이동
const goHome = () => {
  router.push({ name: 'home' })
}

// 다시 시도
const tryAgain = () => {
  router.back()
}
</script>

<style scoped>
</style>
