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

</script>

<template>
    <div class="typing-practice" v-if="currentContent">
        <h2>{{ currentContent.title }}</h2>
        <div class="timer">경과 시간: {{ formattedElapsedTime }}</div>
        <div class="text-display">
            <span v-for="(item, index) in highlightedText" :key="index" :class="item.status">
                {{ item.char }}
            </span>
        </div>
        <textarea v-model="typedText" class="typing-input" placeholder="여기에 입력하세요..." :disabled="isFinished"
            @input="startTimer" rows="5"></textarea>
        <button @click="finishPractice" v-if="isTypingStarted && !isFinished">연습 완료</button>
    </div>
    <div v-else>
        콘텐츠를 불러오는 중...
    </div>
</template>

<style scoped>
.typing-practice {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

h2 {
    margin-bottom: 1rem;
}

.timer {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #555;
}

.text-display {
    width: 100%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;
    background-color: #f9f9f9;
    font-size: 1.2rem;
    line-height: 1.6;
    white-space: pre-wrap;
    /* 줄바꿈 및 공백 유지 */
    font-family: 'Courier New', Courier, monospace;
    /* 고정폭 글꼴 */
}

.text-display span {
    /* 기본 스타일 */
}

.text-display .correct {
    color: green;
    /* background-color: #e0ffe0; */
}

.text-display .incorrect {
    color: red;
    background-color: #ffe0e0;
    text-decoration: line-through;
}

.text-display .default {
    color: #aaa;
    /* 아직 입력 안 된 부분 */
}


.typing-input {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1.1rem;
    resize: none;
    /* 크기 조절 비활성화 */
    font-family: 'Courier New', Courier, monospace;
}

button {
    padding: 0.6rem 1.2rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
}

button:hover {
    background-color: #45a049;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
