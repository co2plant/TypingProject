<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-green-600 mb-2">관리자 페이지</h1>
        <p class="text-gray-600">관리자 계정으로 로그인하세요</p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">로그인</h2>
          <p class="text-gray-600 mt-2">계정 정보를 입력해주세요</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-gray-700">아이디</label>
            <div class="relative">
              <UserIcon class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="username"
                v-model="formData.username"
                type="text"
                placeholder="아이디를 입력하세요"
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700">비밀번호</label>
            <div class="relative">
              <LockIcon class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="비밀번호를 입력하세요"
                class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                <EyeIcon v-if="!showPassword" class="h-4 w-4" />
                <EyeOffIcon v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
          >
            {{ isLoading ? '로그인 중...' : '로그인' }}
          </button>
        </form>
      </div>

      <div class="mt-6 text-center">
        <button @click="goToHome" class="text-gray-600 hover:text-gray-800 transition-colors">
          홈으로 돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User as UserIcon, Lock as LockIcon, Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-vue-next'

const formData = ref({
  username: '',
  password: ''
})

const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    console.log('로그인 시도:', formData.value)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('로그인 성공!')
    
  } catch (error) {
    console.error('로그인 실패:', error)
    alert('로그인에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

const goToHome = () => {
  router.go({ name: 'home' })
}
</script>

<style scoped>
</style>