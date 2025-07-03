<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-primary-600">퀴즈 관리</h1>
      <button 
        @click="showAddForm = true"
        class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md"
      >
        퀴즈 추가
      </button>
    </div>

    <!-- 추가/수정 폼 -->
    <div v-if="showAddForm || editingQuiz" class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h3 class="text-xl font-bold mb-4">{{ editingQuiz ? '퀴즈 수정' : '퀴즈 추가' }}</h3>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>
              <div class="block text-sm font-medium text-gray-700 mb-2">ID</div>
              <input 
              v-model="formData.id"
              type="text" 
              class="w-full border border-gray-300 rounded-md px-3 py-2"
              :disabled="editingQuiz" />
            </label>
          </div>
          <div>
            <label>
              <div  class="block text-sm font-medium text-gray-700 mb-2">카테고리</div>
              <select 
              v-model="formData.category"
              class="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">카테고리 선택</option>
                <option v-for="(desc, name) in categories" :key="name" :value="name">{{ name }}</option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <label>
            <div  class="block text-sm font-medium text-gray-700 mb-2">문제</div>
            <textarea 
            v-model="formData.question"
            class="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
            ></textarea>
          </label>
        </div>
        <div>
          <label>
            <div  class="block text-sm font-medium text-gray-700 mb-2">선택지</div>
            <div class="space-y-2">
              <input 
                v-for="(option, index) in formData.options" 
                :key="index"
                v-model="formData.options[index]"
                type="text" 
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                :placeholder="`선택지 ${index + 1}`" />
            </div>
          </label>
        </div>
        <div>
          <label>
            <div  class="block text-sm font-medium text-gray-700 mb-2">정답</div>
            <select 
            v-model="formData.answer"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">정답 선택</option>
              <option v-for="option in formData.options" :key="option" :value="option">{{ option }}</option>
            </select>
          </label>
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button 
          @click="saveQuiz"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          저장
        </button>
        <button 
          @click="cancelEdit"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          취소
        </button>
      </div>
    </div>

    <!-- 퀴즈 목록 -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">문제</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">정답</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="quiz in quizzes" :key="quiz.id">
            <td class="px-6 py-4 whitespace-nowrap font-mono text-sm">{{ quiz.id }}</td>
            <td class="px-6 py-4">{{ quiz.category }}</td>
            <td class="px-6 py-4 max-w-xs truncate">{{ quiz.question }}</td>
            <td class="px-6 py-4 max-w-xs truncate">{{ quiz.answer }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button 
                @click="editQuiz(quiz)"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                수정
              </button>
              <button 
                @click="deleteQuiz(quiz.id)"
                class="text-red-600 hover:text-red-900"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-8 text-center">
      <router-link 
        to="/admin"
        class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
      >
        관리자 페이지로 돌아가기
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import quizData from '@/data/quizData.json'
import categoryData from '@/data/categoryData.json'

const quizzes = ref([])
const categories = ref({})
const showAddForm = ref(false)
const editingQuiz = ref(null)
const formData = reactive({
  id: '',
  category: '',
  question: '',
  options: ['', '', '', ''],
  answer: ''
})

onMounted(() => {
  quizzes.value = [...quizData]
  categories.value = { ...categoryData }
})

const saveQuiz = () => {
  if (formData.id && formData.category && formData.question && formData.answer) {
    const quizToSave = {
      ...formData,
      options: formData.options.filter(opt => opt.trim() !== '')
    }
    
    if (editingQuiz.value) {
      const index = quizzes.value.findIndex(q => q.id === editingQuiz.value.id)
      if (index !== -1) {
        quizzes.value[index] = quizToSave
      }
    } else {
      quizzes.value.push(quizToSave)
    }
    cancelEdit()
    alert('퀴즈가 저장되었습니다.')
  }
}

const editQuiz = (quiz) => {
  editingQuiz.value = quiz
  Object.assign(formData, {
    ...quiz,
    options: [...quiz.options, '', '', '', ''].slice(0, 4)
  })
  showAddForm.value = false
}

const deleteQuiz = (id) => {
  if (confirm(`퀴즈 '${id}'를 삭제하시겠습니까?`)) {
    const index = quizzes.value.findIndex(q => q.id === id)
    if (index !== -1) {
      quizzes.value.splice(index, 1)
      alert('퀴즈가 삭제되었습니다.')
    }
  }
}

const cancelEdit = () => {
  showAddForm.value = false
  editingQuiz.value = null
  Object.assign(formData, {
    id: '',
    category: '',
    question: '',
    options: ['', '', '', ''],
    answer: ''
  })
}
</script>