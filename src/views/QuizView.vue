<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg p-8" v-if="quizQuestions.length > 0">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-green-600">{{ categoryName }} 퀴즈</h1>
          <p class="text-gray-600">{{ currentIndex + 1 }} / {{ quizQuestions.length }}번 문제</p>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="text-green-600 font-medium">{{ correctCount }}</span>
          <span class="text-gray-400">/</span>
          <span class="text-gray-600">{{ answeredCount }}</span>
        </div>
      </div>
      
      <div class="relative mb-4">
        <div class="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
          <div 
            :style="`width: ${((currentIndex + 1) / quizQuestions.length) * 100}%`" 
            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
          ></div>
        </div>
      </div>
      
      <QuizQuestion
        v-if="!quizCompleted"
        :questionId="currentQuestion.id"
        :question="currentQuestion.question"
        :options="currentQuestion.options"
        :answer="currentQuestion.answer"
        @answer="handleAnswer"
        @next="nextQuestion"
      />
      
      <div v-else class="text-center py-8">
        <h2 class="text-xl font-bold text-green-600 mb-4">퀴즈 완료!</h2>
        <p class="text-gray-600 mb-6">
          총 {{ quizQuestions.length }}문제 중 {{ correctCount }}문제를 맞추셨습니다.
          (정답률: {{ Math.round((correctCount / quizQuestions.length) * 100) }}%)
        </p>
        
        <div class="flex justify-center gap-4 mt-8">
          <button 
            @click="retryQuiz" 
            class="px-4 py-2 bg-white border border-green-500 text-green-600 rounded-md hover:bg-green-50"
          >
            다시 풀기
          </button>
          <button 
            @click="viewResult" 
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            결과 보기
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <p class="text-gray-600">
        해당 카테고리의 퀴즈를 불러오는 중이거나, 퀴즈가 없습니다.
      </p>
      <button 
        @click="goBack"
        class="mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
      >
        돌아가기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuizQuestion from '@/components/QuizQuestion.vue'
import quizData from '@/data/quizData.json'

const route = useRoute()
const router = useRouter()

const categoryName = ref('')
const quizQuestions = ref([])
const currentIndex = ref(0)
const answers = ref([])
const quizCompleted = ref(false)

onMounted(() => {
  const contentId = decodeURIComponent(route.params.contentId || '');
  categoryName.value = decodeURIComponent(route.params.categoryName || '');

  quizQuestions.value = quizData.filter(q => q.category === categoryName.value)

  shuffleQuestions()
  randomizeOptions()
})

const currentQuestion = computed(() => {
  if (quizQuestions.value.length === 0) return null
  return quizQuestions.value[currentIndex.value]
})

const shuffleQuestions = () => {
  for (let i = quizQuestions.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[quizQuestions.value[i], quizQuestions.value[j]] = [quizQuestions.value[j], quizQuestions.value[i]]
  }
}

const randomizeOptions = () => {
  quizQuestions.value.forEach(question => {
    for (let i = question.options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[question.options[i], question.options[j]] = [question.options[j], question.options[i]]
    }
  })
}

const handleAnswer = (answerData) => {
  const question = currentQuestion.value
  answers.value.push({
    question: question.question,
    userAnswer: answerData.userAnswer,
    correctAnswer: question.answer,
    isCorrect: answerData.isCorrect
  })
}

const nextQuestion = () => {
  if (currentIndex.value < quizQuestions.value.length - 1) {
    currentIndex.value++
  } else {
    quizCompleted.value = true
  }
}

const retryQuiz = () => {
  currentIndex.value = 0
  answers.value = []
  quizCompleted.value = false
  shuffleQuestions()
  randomizeOptions()
}

const viewResult = () => {
  const resultData = {
    category: categoryName.value,
    totalQuestions: quizQuestions.value.length,
    correctCount: correctCount.value,
    score: Math.round((correctCount.value / quizQuestions.value.length) * 100),
    answers: answers.value
  };
  localStorage.setItem('quizResult', JSON.stringify(resultData));
  router.push({ name: 'quiz-result' });
}

const goBack = () => {
  router.go(-1);
}

const answeredCount = computed(() => answers.value.length)

const correctCount = computed(() => answers.value.filter(a => a.isCorrect).length)
</script>
