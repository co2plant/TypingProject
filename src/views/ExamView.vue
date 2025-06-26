<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="exam">
      <div v-if="examPhase === 'intro'" class="text-center">
        <h1 class="text-3xl font-bold text-green-600 mb-4">{{ exam.title }}</h1>
        <p class="text-gray-600 mb-8">{{ exam.description }}</p>
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <h2 class="text-xl font-semibold mb-4">시험 안내</h2>
          <p class="mb-6">총 {{ exam.questions.length }}개의 객관식 문제로 구성되어 있습니다.</p>
          <button 
            @click="startExam" 
            class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md transition-colors w-full"
          >
            시험 시작하기
          </button>
        </div>
      </div>
      
      <div v-else>
        <div v-if="examPhase === 'quiz'" class="bg-white rounded-lg shadow-lg p-8">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h2 class="text-2xl font-bold text-green-600">{{ exam.title }}</h2>
              <p class="text-gray-600">{{ currentQuestionIndex + 1 }} / {{ exam.questions.length }}번 문제</p>
            </div>
            <div>
              <span class="text-sm text-gray-500">경과 시간: {{ formatTime(quizElapsedTime) }}</span>
            </div>
          </div>
          
          <div class="relative mb-6">
            <div class="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
              <div 
                :style="`width: ${((currentQuestionIndex + 1) / exam.questions.length) * 100}%`" 
                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
              ></div>
            </div>
          </div>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">{{ currentQuestion.question }}</h3>
            <div class="space-y-3">
              <div 
                v-for="(option, index) in currentQuestion.options" 
                :key="index"
                @click="selectAnswer(option)"
                :class="[
                  'p-4 rounded-lg cursor-pointer border-2 transition-colors',
                  selectedAnswer === option 
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                ]"
              >
                <span>{{ option }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button 
              @click="nextQuestion"
              :disabled="!selectedAnswer"
              :class="[
                'px-6 py-2 rounded-md text-white transition-colors',
                selectedAnswer
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-400 cursor-not-allowed'
              ]"
            >
              {{ currentQuestionIndex === exam.questions.length - 1 ? '결과 보기' : '다음 문제' }}
            </button>
          </div>
        </div>
        
        <div v-else-if="examPhase === 'completed'" class="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 class="text-2xl font-bold text-green-600 mb-4">시험 완료!</h2>
          <p class="text-gray-600 mb-8">결과를 확인하세요.</p>
          <button 
            @click="showResult"
            class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md transition-colors"
          >
            결과 보기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import examData from '@/data/examData.json'

// examId는 라우트 파라미터에서 가져옴
const route = useRoute()
const router = useRouter()
const examId = computed(() => route.params.examId || route.params.id || '')

const exam = ref(null)
const examPhase = ref('intro') // intro, quiz, completed

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
})

function startExam() {
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
  const quizScore = Math.floor((correctAnswers.value / exam.value.questions.length) * 100)
  const resultData = {
    examId: examId.value,
    examTitle: exam.value.title,
    quiz: {
      correctCount: correctAnswers.value,
      totalQuestions: exam.value.questions.length,
      score: quizScore,
      elapsedTime: quizElapsedTime.value,
      answers: userAnswers.value
    },
    totalScore: quizScore
  }
  localStorage.setItem('examResult', JSON.stringify(resultData))
  router.push({ name: 'exam-result' })
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>
