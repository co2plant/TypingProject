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
const elapsedTime = ref(0) 
const progress = ref(0) 


const isTypingStarted = ref(false)
const isFinished = ref(false)


onMounted(() => {
    contentId.value = route.params.contentId
    const foundContent = typingContents.find(c => c.id === contentId.value)
    if (foundContent) {
        currentContent.value = foundContent
        originalText.value = foundContent.content
    } else {
        
        router.push({ name: 'home' })
    }
})

const startTimer = () => {
    if (!isTypingStarted.value) {
        isTypingStarted.value = true
        startTime.value = Date.now()
        timerInterval.value = setInterval(() => {
            elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000)
        }, 1000)
    }
}

const stopTimer = () => {
    if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
    }
    endTime.value = Date.now()
}

watch(typedText, (newValue) => {
    if (!isTypingStarted.value && newValue.length > 0) {
        startTimer()
    }

    progress.value = Math.floor((newValue.length / originalText.value.length) * 100)

    if (newValue.length >= originalText.value.length) {
        typedText.value = newValue.substring(0, originalText.value.length)
        finishPractice()
    }
})

const finishPractice = () => {
    if (isFinished.value) return 
    isFinished.value = true
    stopTimer()

    const finalElapsedTime = (endTime.value - startTime.value) / 1000 
    const typedWords = typedText.value.trim().split(/\s+/).length
    const wpm = Math.round((typedWords / finalElapsedTime) * 60) || 0

    let correctChars = 0
    for (let i = 0; i < typedText.value.length; i++) {
        if (typedText.value[i] === originalText.value[i]) {
            correctChars++
        }
    }
    const accuracy = Math.round((correctChars / originalText.value.length) * 100) || 0

    router.push({
        name: 'practice-result',
        query: {
            wpm: wpm,
            accuracy: accuracy,
            time: finalElapsedTime.toFixed(2) 
        }
    })
}

const highlightedText = computed(() => {
    if (!originalText.value) return []
    const chars = []
    for (let i = 0; i < originalText.value.length; i++) {
        let status = 'default' 
        if (i < typedText.value.length) {
            status = typedText.value[i] === originalText.value[i] ? 'correct' : 'incorrect'
        }
        chars.push({ char: originalText.value[i], status })
    }
    return chars
})

const formattedElapsedTime = computed(() => {
    const minutes = Math.floor(elapsedTime.value / 60)
    const seconds = elapsedTime.value % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const goHome = () => {
    router.push({ name: 'home' })
}
</script>

<template>
    <div class="max-w-3xl mx-auto my-8 px-4" v-if="currentContent">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-100">
                <h2 class="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">{{ currentContent.title }}</h2>
                <div class="flex items-center gap-2 self-end sm:self-auto">
                    <span class="text-gray-600">경과 시간:</span>
                    <span class="bg-gray-100 px-3 py-1 rounded font-medium text-gray-800">{{ formattedElapsedTime }}</span>
                </div>
            </div>
            
            <div class="w-full h-1.5 bg-gray-100">
                <div class="h-full bg-green-500 transition-all duration-300" :style="{ width: `${progress}%` }"></div>
            </div>
            
            <div class="w-full p-6 my-4 bg-gray-50 font-mono text-lg leading-relaxed whitespace-pre-wrap">
                <span 
                    v-for="(item, index) in highlightedText" 
                    :key="index"
                    :class="{
                        'text-secondary-600': item.status === 'correct',
                        'text-red-600 bg-red-50 line-through': item.status === 'incorrect',
                        'text-gray-400': item.status === 'default'
                    }"
                >
                    {{ item.char }}
                </span>
            </div>
            
            <textarea 
                v-model="typedText" 
                class="w-full mx-4 sm:mx-6 mb-6 p-4 border-2 border-gray-200 rounded-lg font-mono text-base resize-none focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder="여기에 입력하세요..." 
                :disabled="isFinished"
                @input="startTimer" 
                rows="5"
                autofocus
                style="width: calc(100% - 2rem); margin: 0 1rem;"
            ></textarea>
            
            <div class="flex justify-between px-4 sm:px-6 pb-6">
                <button 
                    @click="goHome" 
                    class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                    <span>←</span> 홈으로
                </button>
                <button 
                    @click="finishPractice" 
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
                    :disabled="!isTypingStarted || isFinished"
                >
                    연습 완료
                </button>
            </div>
        </div>
    </div>
    <div v-else class="flex justify-center items-center min-h-[300px]">
        <div class="bg-white p-8 rounded-lg shadow-md text-center text-gray-600">
            <p>콘텐츠를 불러오는 중...</p>
        </div>
    </div>
</template>

<style scoped>
</style>
