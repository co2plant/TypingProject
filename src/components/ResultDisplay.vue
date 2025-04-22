<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const wpm = route.query.wpm || 0
const accuracy = route.query.accuracy || 0
const time = route.query.time || 0

const goHome = () => {
    router.push({ name: 'home' })
}

// 이전 연습 콘텐츠 ID를 알 수 없으므로, 홈으로만 이동하도록 단순화
// const retryPractice = () => {
//   // 이전 contentId를 알아야 함. 상태 관리 라이브러리(Pinia/Vuex) 또는 다른 방법 필요
//   // MVP에서는 홈으로 이동하는 것으로 대체
//   router.push({ name: 'home' })
// }
</script>

<template>
    <div class="result-display">
        <h2>연습 결과</h2>
        <div class="result-item">
            <span class="label">타자 속도 (WPM):</span>
            <span class="value">{{ wpm }}</span>
        </div>
        <div class="result-item">
            <span class="label">정확도:</span>
            <span class="value">{{ accuracy }}%</span>
        </div>
        <div class="result-item">
            <span class="label">소요 시간:</span>
            <span class="value">{{ time }}초</span>
        </div>
        <div class="actions">
            <button @click="goHome">홈으로 돌아가기</button>
            <!-- <button @click="retryPractice">다시 연습하기</button> -->
        </div>
    </div>
</template>

<style scoped>
.result-display {
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
    background-color: #fff;
}

h2 {
    margin-bottom: 2rem;
    color: #333;
}

.result-item {
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.label {
    font-weight: bold;
    margin-right: 0.5rem;
    color: #555;
}

.value {
    color: #007bff;
}

.actions {
    margin-top: 2rem;
}

button {
    padding: 0.8rem 1.5rem;
    margin: 0 0.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
}

button:hover {
    background-color: #0056b3;
}

/* 다시하기 버튼 스타일 (필요시) */
/* button:last-child {
  background-color: #6c757d;
}

button:last-child:hover {
  background-color: #5a6268;
} */
</style>
