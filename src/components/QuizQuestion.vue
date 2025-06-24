<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
    <div class="p-6 border-b border-gray-100">
      <h3 class="text-xl font-semibold text-gray-800">{{ question }}</h3>
    </div>
    
    <div class="p-6">
      <div class="space-y-3">
        <div 
          v-for="(option, index) in options" 
          :key="index"
          class="flex items-start"
        >
          <label 
            :for="`option-${index}`"
            class="w-full p-4 border rounded-lg cursor-pointer flex items-center"
            :class="{
              'border-gray-200 hover:bg-gray-50': selectedOption !== index && !showAnswer,
              'border-primary-500 bg-primary-50': selectedOption === index && !showAnswer,
              'border-green-500 bg-green-50': showAnswer && option === answer,
              'border-red-500 bg-red-50': showAnswer && selectedOption === index && option !== answer
            }"
          >
            <input 
              type="radio" 
              :id="`option-${index}`" 
              :name="`question-${questionId}`" 
              :value="index" 
              v-model="selectedOption"
              class="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500"
              :disabled="showAnswer"
            />
            <span :class="{'font-medium': showAnswer && option === answer}">{{ option }}</span>
          </label>
        </div>
      </div>
      
      <div class="mt-6 flex justify-between">
        <div v-if="showAnswer" class="text-sm text-gray-600">
          <span v-if="isCorrect" class="text-green-600 font-medium">정답입니다!</span>
          <span v-else class="text-red-600 font-medium">틀렸습니다. 정답: {{ answer }}</span>
        </div>
        <div v-else class="flex-grow"></div>
        
        <button 
          @click="checkAnswer" 
          v-if="!showAnswer" 
          :disabled="selectedOption === null"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          답변 제출
        </button>
        
        <button 
          @click="$emit('next')" 
          v-else
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
        >
          다음 문제
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  questionId: {
    type: String, 
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['answer', 'next'])

const selectedOption = ref(null)
const showAnswer = ref(false)

// questionId가 변경될 때마다 상태 초기화
watch(() => props.questionId, () => {
  selectedOption.value = null
  showAnswer.value = false
})

const isCorrect = computed(() => {
  if (selectedOption.value === null) return false
  return props.options[selectedOption.value] === props.answer
})

const checkAnswer = () => {
  showAnswer.value = true
  emit('answer', {
    questionId: props.questionId,
    userAnswer: props.options[selectedOption.value],
    isCorrect: isCorrect.value
  })
}
</script>

<style scoped>
</style>
