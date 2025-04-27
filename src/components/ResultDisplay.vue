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

// 속도 등급 계산
const speedRating = computed(() => {
  const wpm = results.value.wpm
  if (wpm < 30) return { label: '초보', color: '#ff9800' }
  if (wpm < 50) return { label: '평균', color: '#8bc34a' }
  if (wpm < 70) return { label: '양호', color: '#4caf50' }
  if (wpm < 90) return { label: '빠름', color: '#2196f3' }
  return { label: '전문가', color: '#9c27b0' }
})

// 정확도 등급 계산
const accuracyRating = computed(() => {
  const accuracy = results.value.accuracy
  if (accuracy < 80) return { label: '개선 필요', color: '#ff9800' }
  if (accuracy < 90) return { label: '양호', color: '#8bc34a' }
  if (accuracy < 97) return { label: '매우 좋음', color: '#4caf50' }
  return { label: '우수', color: '#2196f3' }
})

// 성능 분석 메시지
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

<template>
    <div class="result-container">
      <div class="result-card">
        <div class="card-header">
          <h2>타자 연습 결과</h2>
        </div>
        
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-value">{{ results.wpm }} WPM</div>
            <div class="stat-label" :style="{ color: speedRating.color }">{{ speedRating.label }}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">✓</div>
            <div class="stat-value">{{ results.accuracy }}%</div>
            <div class="stat-label" :style="{ color: accuracyRating.color }">{{ accuracyRating.label }}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-value">{{ results.time.toFixed(1) }}초</div>
            <div class="stat-label">총 시간</div>
          </div>
        </div>
        
        <div class="analysis-section">
          <h3>성능 분석</h3>
          <p>
            당신은 <span class="highlight">{{ results.wpm }} 분당 단어</span>의 속도로 타자를 쳤으며, 
            정확도는 <span class="highlight">{{ results.accuracy }}%</span> 입니다.
          </p>
          <p>{{ performanceMessage }}</p>
        </div>
        
        <div class="button-group">
          <button @click="goHome" class="btn btn-secondary">
            <span class="btn-icon">🏠</span> 홈으로
          </button>
          <button @click="tryAgain" class="btn btn-primary">
            <span class="btn-icon">🔄</span> 다시 시도
          </button>
        </div>
      </div>
    </div>
  </template>

<style scoped>
.result-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.result-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 2rem;
}

.stat-card {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.analysis-section {
  padding: 0 2rem 2rem;
  background-color: #f9f9f9;
  margin: 0 2rem 2rem;
  border-radius: 8px;
}

.analysis-section h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 1rem 0;
  color: #333;
}

.analysis-section p {
  margin: 0.75rem 0;
  line-height: 1.6;
  color: #555;
}

.highlight {
  font-weight: 600;
  color: #4CAF50;
}

.button-group {
  display: flex;
  justify-content: space-between;
  padding: 0 2rem 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #43a047;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-icon {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .analysis-section {
    margin: 0 1rem 1.5rem;
    padding: 0 1rem 1.5rem;
  }
  
  .button-group {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1.5rem 1.5rem;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
