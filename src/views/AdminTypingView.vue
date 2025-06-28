<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-primary-600">타이핑 콘텐츠 관리</h1>
      <button 
        @click="showAddForm = true"
        class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md"
      >
        콘텐츠 추가
      </button>
    </div>

    <!-- 추가/수정 폼 -->
    <div v-if="showAddForm || editingContent" class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h3 class="text-xl font-bold mb-4">{{ editingContent ? '콘텐츠 수정' : '콘텐츠 추가' }}</h3>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ID</label>
            <input 
              v-model="formData.id"
              type="text" 
              class="w-full border border-gray-300 rounded-md px-3 py-2"
              :disabled="editingContent"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <select 
              v-model="formData.category"
              class="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">카테고리 선택</option>
              <option v-for="(desc, name) in categories" :key="name" :value="name">{{ name }}</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <input 
            v-model="formData.title"
            type="text" 
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">설명</label>
          <textarea 
            v-model="formData.description"
            class="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">타이핑 콘텐츠</label>
          <textarea 
            v-model="formData.content"
            class="w-full border border-gray-300 rounded-md px-3 py-2 h-40"
            placeholder="타이핑 연습용 텍스트를 입력하세요"
          ></textarea>
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button 
          @click="saveContent"
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

    <!-- 콘텐츠 목록 -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">콘텐츠 길이</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="content in contents" :key="content.id">
            <td class="px-6 py-4 whitespace-nowrap font-mono text-sm">{{ content.id }}</td>
            <td class="px-6 py-4 font-medium">{{ content.title }}</td>
            <td class="px-6 py-4">{{ content.category }}</td>
            <td class="px-6 py-4">{{ content.content?.length || 0 }}자</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button 
                @click="editContent(content)"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                수정
              </button>
              <button 
                @click="deleteContent(content.id)"
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
import typingData from '@/data/typingContents.json'
import categoryData from '@/data/categoryData.json'

const contents = ref([])
const categories = ref({})
const showAddForm = ref(false)
const editingContent = ref(null)
const formData = reactive({
  id: '',
  title: '',
  description: '',
  content: '',
  category: ''
})

onMounted(() => {
  contents.value = [...typingData]
  categories.value = { ...categoryData }
})

const saveContent = () => {
  if (formData.id && formData.title && formData.category && formData.content) {
    if (editingContent.value) {
      const index = contents.value.findIndex(c => c.id === editingContent.value.id)
      if (index !== -1) {
        contents.value[index] = { ...formData }
      }
    } else {
      contents.value.push({ ...formData })
    }
    cancelEdit()
    alert('콘텐츠가 저장되었습니다.')
  }
}

const editContent = (content) => {
  editingContent.value = content
  Object.assign(formData, content)
  showAddForm.value = false
}

const deleteContent = (id) => {
  if (confirm(`콘텐츠 '${id}'를 삭제하시겠습니까?`)) {
    const index = contents.value.findIndex(c => c.id === id)
    if (index !== -1) {
      contents.value.splice(index, 1)
      alert('콘텐츠가 삭제되었습니다.')
    }
  }
}

const cancelEdit = () => {
  showAddForm.value = false
  editingContent.value = null
  Object.assign(formData, {
    id: '',
    title: '',
    description: '',
    content: '',
    category: ''
  })
}
</script>