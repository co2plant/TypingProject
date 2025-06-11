<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="!started" class="text-center">
      <h1 class="text-3xl font-bold text-primary-600 mb-4">{{ exam.title }}</h1>
      <p class="text-gray-600 mb-8">{{ exam.description }}</p>
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h2 class="text-xl font-semibold mb-4">시험 안내</h2>
        <p class="mb-2">1. 먼저 타이핑 테스트를 완료해주세요.</p>
        <p class="mb-2">2. 이후 {{ exam.questions.length }}개의 객관식 문제가 제공됩니다.</p>
        <p class="mb-6">3. 타이핑 정확도와 퀴즈 점수를 합산하여 최종 점수가 계산됩니다.</p>
        
        <button 
          @click="startExam" 
          class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md transition-colors w-full"
        >
          시험 시작하기
        </button>
      </div>
    </div>
    
    <div v-else>
      <div v-if="examPhase === 'typing'" class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold text-primary-600 mb-4">타이핑 테스트</h2>
        
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div class="mb-4">
            <div class="text-lg leading-relaxed text-gray-700">
              <span 
                v-for="(char, index) in exam.typingContent" 
                :key="index" 
                :class="{
                  'bg-green-200': index < typedText.length && char === typedText[index],
                  'bg-red-200': index < typedText.length && char !== typedText[index],
                  'font-bold underline': index === typedText.length,
                }"
              >{{ char }}</span>
            </div>
          </div>
          
          <div>
            <textarea 
              ref="typingInput"
              v-model="typedText"
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-primary-500 focus:outline-none"
              rows="5"
              placeholder="여기에 텍스트를 입력하세요..."
              @input="checkTyping"
              :disabled="typingCompleted"
            ></textarea>
          </div>
          
          <div class="mt-4 flex justify-between text-sm">
            <div>
              <span class="font-semibold text-primary-600">진행률:</span> 
              {{ Math.floor((typedText.length / exam.typingContent.length) * 100) }}%
            </div>
            <div>
              <span class="font-semibold text-primary-600">정확도:</span>
              {{ typingAccuracy }}%
            </div>
            <div>
              <span class="font-semibold text-primary-600">경과 시간:</span>
              {{ formatTime(typingElapsedTime) }}
            </div>
          </div>
        </div>
        
        <div v-if="typingCompleted" class="text-center">
          <button 
            @click="startQuizPhase" 
            class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md transition-colors"
          >
            퀴즈로 계속하기
          </button>
        </div>
      </div>
      
      <div v-else-if="examPhase === 'quiz'" class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-primary-600 mb-4">퀴즈 ({{ currentQuestionIndex + 1 }} / {{ exam.questions.length }})</h2>
        
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">{{ currentQuestion.question }}</h3>
            
            <div class="space-y-3">
              <div 
                v-for="(option, index) in currentQuestion.options" 
                :key="index"
                @click="selectAnswer(option)"
                :class="[
                  'p-3 rounded-md cursor-pointer border-2 transition-colors',
                  selectedAnswer === option 
                    ? 'border-primary-500 bg-primary-100'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                ]"
              >
                <span>{{ option }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex justify-between items-center">
            <div>
              <span class="text-sm text-gray-500">경과 시간: {{ formatTime(quizElapsedTime) }}</span>
            </div>
            
            <button 
              @click="nextQuestion"
              :disabled="!selectedAnswer"
              :class="[
                'px-6 py-2 rounded-md text-white transition-colors',
                selectedAnswer
                  ? 'bg-primary-500 hover:bg-primary-600'
                  : 'bg-gray-400 cursor-not-allowed'
              ]"
            >
              {{ currentQuestionIndex === exam.questions.length - 1 ? '결과 보기' : '다음 문제' }}
            </button>
          </div>
        </div>
      </div>
      
      <div v-else-if="examPhase === 'completed'" class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-primary-600 mb-4">시험 완료!</h2>
        <p class="text-gray-600 mb-8">결과를 확인하세요.</p>
        
        <button 
          @click="showResult"
          class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md transition-colors w-full"
        >
          결과 보기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import examData from '@/data/examData.json'

// examId는 라우트 파라미터에서 가져옴
const route = useRoute()
const router = useRouter()
const examId = computed(() => route.params.examId || route.params.id || '')

const exam = ref(null)
const started = ref(false)
const examPhase = ref('typing') // typing, quiz, completed

// 타이핑 관련 데이터
const typedText = ref('')
const typingStartTime = ref(null)
const typingEndTime = ref(null)
const typingElapsedTime = ref(0)
const typingTimer = ref(null)
const typingCompleted = ref(false)
const typingAccuracy = ref(100)
const typingInput = ref(null)

// 퀴즈 관련 데이터
const currentQuestionIndex = ref(0)
const selectedAnswer = ref('')
const quizStartTime = ref(null)
const quizEndTime = ref(null)
const quizElapsedTime = ref(0)
const quizTimer = ref(null)
const userAnswers = ref([])
const correctAnswers = ref(0)

const currentQuestion = computed(() => {
  if (!exam.value || !exam.value.questions || currentQuestionIndex.value >= exam.value.questions.length) {
    return null
  }
  return exam.value.questions[currentQuestionIndex.value]
})

onMounted(() => {
  exam.value = examData.find(e => e.id === examId.value)
  if (!exam.value) {
    router.push({ name: 'exam-categories' })
  }
})

function startExam() {
  started.value = true
  typingStartTime.value = new Date()
  typingTimer.value = setInterval(() => {
    typingElapsedTime.value = Math.floor((new Date() - typingStartTime.value) / 1000)
  }, 1000)
  nextTick(() => {
    typingInput.value?.focus()
  })
}

function checkTyping() {
  const text = exam.value.typingContent
  const typed = typedText.value
  let correctChars = 0
  const minLength = Math.min(text.length, typed.length)
  for (let i = 0; i < minLength; i++) {
    if (text[i] === typed[i]) correctChars++
  }
  typingAccuracy.value = typed.length > 0 
    ? Math.floor((correctChars / typed.length) * 100) 
    : 100
  if (typed.length >= text.length) {
    completeTypingPhase()
  }
}

function completeTypingPhase() {
  typingCompleted.value = true
  typingEndTime.value = new Date()
  clearInterval(typingTimer.value)
}

function startQuizPhase() {
  examPhase.value = 'quiz'
  quizStartTime.value = new Date()
  quizTimer.value = setInterval(() => {
    quizElapsedTime.value = Math.floor((new Date() - quizStartTime.value) / 1000)
  }, 1000)
}

function selectAnswer(option) {
  selectedAnswer.value = option
}

function nextQuestion() {
  userAnswers.value.push({
    question: currentQuestion.value.question,
    userAnswer: selectedAnswer.value,
    correctAnswer: currentQuestion.value.answer,
    isCorrect: selectedAnswer.value === currentQuestion.value.answer
  })
  if (selectedAnswer.value === currentQuestion.value.answer) {
    correctAnswers.value++
  }
  if (currentQuestionIndex.value < exam.value.questions.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = ''
  } else {
    completeExam()
  }
}

function completeExam() {
  examPhase.value = 'completed'
  quizEndTime.value = new Date()
  clearInterval(quizTimer.value)
}

function showResult() {
  const typingWPM = calculateWPM(
    exam.value.typingContent.length,
    typingElapsedTime.value
  )
  const resultData = {
    examId: examId.value,
    examTitle: exam.value.title,
    typing: {
      accuracy: typingAccuracy.value,
      wpm: typingWPM,
      elapsedTime: typingElapsedTime.value
    },
    quiz: {
      correctCount: correctAnswers.value,
      totalQuestions: exam.value.questions.length,
      score: Math.floor((correctAnswers.value / exam.value.questions.length) * 100),
      elapsedTime: quizElapsedTime.value,
      answers: userAnswers.value
    },
    totalScore: Math.floor(
      (typingAccuracy.value * 0.3) + 
      ((correctAnswers.value / exam.value.questions.length) * 100 * 0.7)
    )
  }
  localStorage.setItem('examResult', JSON.stringify(resultData))
  router.push({ name: 'exam-result' })
}

function calculateWPM(charCount, seconds) {
  const words = charCount / 5
  const minutes = seconds / 60
  return minutes > 0 ? Math.floor(words / minutes) : 0
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>
