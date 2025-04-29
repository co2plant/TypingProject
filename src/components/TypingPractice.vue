<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import typingContents from '@/data/typingContents.json'

const route = useRoute()
const router = useRouter()

const contentId = ref(null)
const currentContent = ref(null)
const originalText = ref('')
const typedText = ref('')
const startTime = ref(null)
const endTime = ref(null)
const timerInterval = ref(null)
const elapsedTime = ref(0) // 초 단위 경과 시간
const progress = ref(0) // 진행률 (0-100)

// 입력 상태 관리
const isTypingStarted = ref(false)
const isFinished = ref(false)

// 현재 콘텐츠 로드
onMounted(() => {
    contentId.value = route.params.contentId
    const foundContent = typingContents.find(c => c.id === contentId.value)
    if (foundContent) {
        currentContent.value = foundContent
        originalText.value = foundContent.content
    } else {
        // 콘텐츠 못 찾으면 홈으로 리다이렉트 또는 에러 처리
        router.push({ name: 'home' })
    }
})

// 타이머 시작
const startTimer = () => {
    if (!isTypingStarted.value) {
        isTypingStarted.value = true
        startTime.value = Date.now()
        timerInterval.value = setInterval(() => {
            elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000)
        }, 1000)
    }
}

// 타이머 중지
const stopTimer = () => {
    if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
    }
    endTime.value = Date.now()
}

// 입력 처리 및 완료 확인
watch(typedText, (newValue) => {
    if (!isTypingStarted.value && newValue.length > 0) {
        startTimer()
    }

    // 진행률 업데이트
    progress.value = Math.floor((newValue.length / originalText.value.length) * 100)

    if (newValue.length >= originalText.value.length) {
        typedText.value = newValue.substring(0, originalText.value.length) // 입력 길이 제한
        finishPractice()
    }
})

// 연습 완료 처리
const finishPractice = () => {
    if (isFinished.value) return // 중복 실행 방지
    isFinished.value = true
    stopTimer()

    const finalElapsedTime = (endTime.value - startTime.value) / 1000 // 초 단위
    const typedWords = typedText.value.trim().split(/\s+/).length
    const wpm = Math.round((typedWords / finalElapsedTime) * 60) || 0

    let correctChars = 0
    for (let i = 0; i < typedText.value.length; i++) {
        if (typedText.value[i] === originalText.value[i]) {
            correctChars++
        }
    }
    const accuracy = Math.round((correctChars / originalText.value.length) * 100) || 0

    // 결과 페이지로 이동 (쿼리 파라미터 사용)
    router.push({
        name: 'result',
        query: {
            wpm: wpm,
            accuracy: accuracy,
            time: finalElapsedTime.toFixed(2) // 소수점 2자리까지
        }
    })
}

// 계산된 속성: 현재까지 입력된 텍스트와 원본 텍스트 비교 시각화
const highlightedText = computed(() => {
    if (!originalText.value) return []
    const chars = []
    for (let i = 0; i < originalText.value.length; i++) {
        let status = 'default' // 아직 입력 안됨
        if (i < typedText.value.length) {
            status = typedText.value[i] === originalText.value[i] ? 'correct' : 'incorrect'
        }
        chars.push({ char: originalText.value[i], status })
    }
    return chars
})

// 경과 시간을 분:초 형식으로 변환
const formattedElapsedTime = computed(() => {
    const minutes = Math.floor(elapsedTime.value / 60)
    const seconds = elapsedTime.value % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// 홈으로 돌아가기
const goHome = () => {
    router.push({ name: 'home' })
}
</script>

<template>
    <div class="typing-practice" v-if="currentContent">
        <div class="card">
            <div class="card-header">
                <h2>{{ currentContent.title }}</h2>
                <div class="timer">
                    <span class="timer-label">경과 시간:</span>
                    <span class="timer-value">{{ formattedElapsedTime }}</span>
                </div>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
            </div>
            
            <div class="text-display">
                <span v-for="(item, index) in highlightedText" :key="index" :class="item.status">
                    {{ item.char }}
                </span>
            </div>
            
            <textarea 
                v-model="typedText" 
                class="typing-input" 
                placeholder="여기에 입력하세요..." 
                :disabled="isFinished"
                @input="startTimer" 
                rows="5"
                autofocus
            ></textarea>
            
            <div class="button-group">
                <button @click="goHome" class="btn btn-secondary">
                    <span class="btn-icon">←</span> 홈으로
                </button>
                <button 
                    @click="finishPractice" 
                    class="btn btn-primary"
                    :disabled="!isTypingStarted || isFinished"
                >
                    연습 완료
                </button>
            </div>
        </div>
    </div>
    <div v-else class="loading-container">
        <div class="loading-card">
            <p>콘텐츠를 불러오는 중...</p>
        </div>
    </div>
</template>

<style scoped>
.typing-practice {
    max-width: 800px;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card {
    width: 100%;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.card-header {
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
}

h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
}

.timer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
}

.timer-label {
    color: #666;
}

.timer-value {
    font-weight: 600;
    color: #333;
    background-color: #f5f5f5;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background-color: #f0f0f0;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background-color: #4CAF50;
    transition: width 0.3s ease;
}

.text-display {
    width: 100%;
    padding: 1.5rem 2rem;
    margin: 1rem 0;
    background-color: #f9f9f9;
    font-size: 1.2rem;
    line-height: 1.8;
    white-space: pre-wrap;
    font-family: 'Courier New', Courier, monospace;
    border-radius: 8px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.text-display .correct {
    color: #2e7d32;
}

.text-display .incorrect {
    color: #d32f2f;
    background-color: #ffebee;
    text-decoration: line-through;
    border-radius: 2px;
}

.text-display .default {
    color: #9e9e9e;
}

.typing-input {
    width: calc(100% - 4rem);
    margin: 0 2rem 1.5rem;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1.1rem;
    resize: none;
    font-family: 'Courier New', Courier, monospace;
    transition: border-color 0.2s ease;
}

.typing-input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.button-group {
    display: flex;
    justify-content: space-between;
    padding: 0 2rem 1.5rem;
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

.btn-primary:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
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

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}

.loading-card {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-align: center;
    color: #666;
}

@media (max-width: 768px) {
    .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }
    
    .timer {
        align-self: flex-end;
    }
    
    .typing-input {
        width: calc(100% - 2rem);
        margin: 0 1rem 1rem;
    }
    
    .button-group {
        padding: 0 1rem 1rem;
    }
}
</style>
