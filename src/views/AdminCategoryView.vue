<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-primary-600">카테고리 관리</h1>
      <button 
        @click="showAddForm = true"
        class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md"
      >
        카테고리 추가
      </button>
    </div>

    <!-- 추가/수정 폼 -->
    <div v-if="showAddForm || editingCategory" class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h3 class="text-xl font-bold mb-4">{{ editingCategory ? '카테고리 수정' : '카테고리 추가' }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">카테고리명</label>
          <input 
            v-model="formData.name"
            type="text" 
            class="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="카테고리명 입력"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">설명</label>
          <input 
            v-model="formData.description"
            type="text" 
            class="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="카테고리 설명 입력"
          >
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button 
          @click="saveCategory"
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

    <!-- 카테고리 목록 -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리명</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">설명</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(description, name) in categories" :key="name">
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ name }}</td>
            <td class="px-6 py-4">{{ description }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button 
                @click="editCategory(name, description)"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                수정
              </button>
              <button 
                @click="deleteCategory(name)"
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
import categoryData from '@/data/categoryData.json'

const categories = ref({})
const showAddForm = ref(false)
const editingCategory = ref(null)
const formData = reactive({
  name: '',
  description: ''
})

onMounted(() => {
  categories.value = { ...categoryData }
})

const saveCategory = () => {
  if (formData.name && formData.description) {
    categories.value[formData.name] = formData.description
    cancelEdit()
    alert('카테고리가 저장되었습니다.')
  }
}

const editCategory = (name, description) => {
  editingCategory.value = name
  formData.name = name
  formData.description = description
  showAddForm.value = false
}

const deleteCategory = (name) => {
  if (confirm(`'${name}' 카테고리를 삭제하시겠습니까?`)) {
    delete categories.value[name]
    alert('카테고리가 삭제되었습니다.')
  }
}

const cancelEdit = () => {
  showAddForm.value = false
  editingCategory.value = null
  formData.name = ''
  formData.description = ''
}
</script>