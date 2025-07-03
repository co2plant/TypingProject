<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-primary-600">시험 관리</h1>
      <button 
        @click="showAddForm = true"
        class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md"
      >
        시험 추가
      </button>
    </div>

    <!-- 추가/수정 폼 -->
    <div v-if="showAddForm || editingExam" class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h3 class="text-xl font-bold mb-4">{{ editingExam ? '시험 수정' : '시험 추가' }}</h3>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>
              <div  class="block text-sm font-medium text-gray-700 mb-2">ID</div>
              <input 
              v-model="formData.id"
              type="text" 
              class="w-full border border-gray-300 rounded-md px-3 py-2"
              :disabled="editingExam" />
            </label>
          </div>
          <div>
            <label>
              <div class="block text-sm font-medium text-gray-700 mb-2">카테고리</div>
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
            <div class="block text-sm font-medium text-gray-700 mb-2">제목</div>
            <input 
            v-model="formData.title"
            type="text" 
            class="w-full border border-gray-300 rounded-md px-3 py-2" />
          </label>
        </div>
        <div>
          <label>
            <div  class="block text-sm font-medium text-gray-700 mb-2">설명</div>
            <textarea 
            v-model="formData.description"
            class="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
            ></textarea>
          </label>
        </div>
        <div>
          <label>
            <div class="block text-sm font-medium text-gray-700 mb-2">타이핑 콘텐츠</div>
            <textarea 
            v-model="formData.typingContent"
            class="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
            ></textarea>
          </label>
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button 
          @click="saveExam"
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

    <!-- 시험 목록 -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">문제 수</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="exam in exams" :key="exam.id">
            <td class="px-6 py-4 whitespace-nowrap font-mono text-sm">{{ exam.id }}</td>
            <td class="px-6 py-4 font-medium">{{ exam.title }}</td>
            <td class="px-6 py-4">{{ exam.category }}</td>
            <td class="px-6 py-4">{{ exam.questions?.length || 0 }}개</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button 
                @click="editExam(exam)"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                수정
              </button>
              <button 
                @click="deleteExam(exam.id)"
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
import examData from '@/data/examData.json'
import categoryData from '@/data/categoryData.json'

const exams = ref([])
const categories = ref({})
const showAddForm = ref(false)
const editingExam = ref(null)
const formData = reactive({
  id: '',
  title: '',
  category: '',
  description: '',
  typingContent: '',
  questions: []
})

onMounted(() => {
  exams.value = [...examData]
  categories.value = { ...categoryData }
})

const saveExam = () => {
  if (formData.id && formData.title && formData.category) {
    if (editingExam.value) {
      const index = exams.value.findIndex(e => e.id === editingExam.value.id)
      if (index !== -1) {
        exams.value[index] = { ...formData }
      }
    } else {
      exams.value.push({ ...formData })
    }
    cancelEdit()
    alert('시험이 저장되었습니다.')
  }
}

const editExam = (exam) => {
  editingExam.value = exam
  Object.assign(formData, exam)
  showAddForm.value = false
}

const deleteExam = (id) => {
  if (confirm(`시험 '${id}'를 삭제하시겠습니까?`)) {
    const index = exams.value.findIndex(e => e.id === id)
    if (index !== -1) {
      exams.value.splice(index, 1)
      alert('시험이 삭제되었습니다.')
    }
  }
}

const cancelEdit = () => {
  showAddForm.value = false
  editingExam.value = null
  Object.assign(formData, {
    id: '',
    title: '',
    category: '',
    description: '',
    typingContent: '',
    questions: []
  })
}
</script>