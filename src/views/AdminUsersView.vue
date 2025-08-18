<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-primary-600">사용자 관리</h1>
      
      <div class="flex space-x-3">
        <button 
          @click="showAddUserModal = true" 
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          사용자 추가
        </button>
        
        <button 
          @click="exportUserData" 
          class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          내보내기
        </button>
      </div>
    </div>
    
    <!-- 필터 및 검색 섹션 -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">역할별 필터</label>
          <select 
            v-model="filters.role" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">모든 역할</option>
            <option value="user">일반 사용자</option>
            <option value="admin">관리자</option>
            <option value="premium">프리미엄 사용자</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">상태별 필터</label>
          <select 
            v-model="filters.status" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">모든 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
            <option value="suspended">정지</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">검색</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              v-model="filters.search" 
              placeholder="이름, 이메일, ID 검색" 
              class="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- 사용자 목록 테이블 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사용자
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                역할 / 상태
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학습 활동
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가입일
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                최근 로그인
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(user, index) in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <span class="inline-flex items-center justify-center h-10 w-10 rounded-full" :class="getAvatarColor(user.name)">
                      <span class="text-lg font-medium leading-none text-white">{{ getUserInitials(user.name) }}</span>
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col">
                  <span :class="{
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                    'bg-primary-100 text-primary-800': user.role === 'admin',
                    'bg-yellow-100 text-yellow-800': user.role === 'premium',
                    'bg-gray-100 text-gray-800': user.role === 'user'
                  }">
                    {{ getRoleLabel(user.role) }}
                  </span>
                  <span class="mt-1" :class="{
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': user.status === 'active',
                    'bg-gray-100 text-gray-500': user.status === 'inactive',
                    'bg-red-100 text-red-800': user.status === 'suspended'
                  }">
                    {{ getStatusLabel(user.status) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.stats.completedExercises }} 연습 완료</div>
                <div class="text-xs text-gray-500">
                  <span class="text-primary-600">{{ user.stats.avgAccuracy }}% 정확도</span> | 
                  <span class="text-green-600">{{ user.stats.avgWPM }} WPM</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.joinedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.lastLogin) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="editUser(user, index)" 
                  class="text-primary-600 hover:text-primary-900 mr-3"
                >
                  수정
                </button>
                <button 
                  @click="confirmDeleteUser(user, index)" 
                  class="text-red-600 hover:text-red-900"
                >
                  삭제
                </button>
              </td>
            </tr>
            <!-- 데이터 없을 때 -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <div class="text-lg font-medium">사용자를 찾을 수 없습니다</div>
                  <div class="text-sm">검색 필터를 변경하거나 새 사용자를 추가해보세요</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 페이지네이션 -->
    <div class="flex justify-between items-center mb-8">
      <div class="text-sm text-gray-700">
        전체 <span class="font-medium">{{ totalUsers }}</span>명 중 <span class="font-medium">{{ filteredUsers.length }}</span>명 표시
      </div>
      <div class="flex space-x-1">
        <button
          @click="currentPage > 1 ? currentPage-- : null"
          :disabled="currentPage === 1"
          :class="[
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md',
            currentPage === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
        >
          이전
        </button>
        <button
          v-for="page in totalPages" 
          :key="page"
          @click="currentPage = page"
          :class="[
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
            currentPage === page 
              ? 'bg-primary-600 text-white border-primary-600'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="currentPage < totalPages ? currentPage++ : null"
          :disabled="currentPage === totalPages"
          :class="[
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md',
            currentPage === totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
        >
          다음
        </button>
      </div>
    </div>
    
    <!-- 사용자 등록/수정 모달 -->
    <div 
      v-if="showAddUserModal || showEditUserModal" 
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
    >
      <div class="relative bg-white rounded-lg max-w-xl w-full shadow-xl">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ showAddUserModal ? '새 사용자 추가' : '사용자 정보 수정' }}
            </h3>
            <button 
              @click="closeUserModal" 
              class="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveUser">
            <div class="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label for="userName" class="block text-sm font-medium text-gray-700 mb-1">사용자 이름</label>
                <input 
                  id="userName" 
                  type="text" 
                  v-model="editingUser.name" 
                  required
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label for="userEmail" class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input 
                  id="userEmail" 
                  type="email" 
                  v-model="editingUser.email" 
                  required
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              
              <div v-if="showAddUserModal">
                <label for="userPassword" class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                <input 
                  id="userPassword" 
                  type="password" 
                  v-model="editingUser.password" 
                  required
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label for="userRole" class="block text-sm font-medium text-gray-700 mb-1">역할</label>
                <select 
                  id="userRole" 
                  v-model="editingUser.role" 
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="user">일반 사용자</option>
                  <option value="premium">프리미엄 사용자</option>
                  <option value="admin">관리자</option>
                </select>
              </div>
              
              <div>
                <label for="userStatus" class="block text-sm font-medium text-gray-700 mb-1">계정 상태</label>
                <select 
                  id="userStatus" 
                  v-model="editingUser.status" 
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                  <option value="suspended">정지</option>
                </select>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                type="button" 
                @click="closeUserModal" 
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
              >
                취소
              </button>
              <button 
                type="submit" 
                class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                {{ showAddUserModal ? '추가' : '저장' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 삭제 확인 모달 -->
    <div 
      v-if="showDeleteConfirm" 
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
    >
      <div class="relative bg-white rounded-lg max-w-md w-full shadow-xl">
        <div class="p-6">
          <div class="mb-4">
            <div class="flex justify-center mb-4">
              <div class="bg-red-100 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-medium text-gray-900 text-center">사용자 삭제</h3>
            <p class="text-gray-500 mt-2 text-center">
              정말 <strong>{{ userToDelete?.name }}</strong> 사용자를 삭제하시겠습니까?<br>
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          
          <div class="flex justify-center space-x-3 mt-5">
            <button 
              type="button" 
              @click="showDeleteConfirm = false" 
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              취소
            </button>
            <button 
              type="button" 
              @click="deleteUser" 
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 액션 알림 토스트 -->
    <div 
      v-if="notification.show"
      class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2"
      :class="{
        'bg-green-500 text-white': notification.type === 'success',
        'bg-red-500 text-white': notification.type === 'error',
        'bg-primary-500 text-white': notification.type === 'info'
      }"
    >
      <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <svg v-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <svg v-if="notification.type === 'info'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ notification.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// 더미 데이터
const users = ref([
  {
    id: 'usr_001',
    name: '김개발',
    email: 'developer.kim@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2025-01-15T09:30:00',
    lastLogin: '2025-08-16T14:22:00',
    stats: {
      completedExercises: 128,
      avgAccuracy: 98,
      avgWPM: 75
    }
  },
  {
    id: 'usr_002',
    name: '이프론트',
    email: 'frontend.lee@example.com',
    role: 'premium',
    status: 'active',
    joinedAt: '2025-03-22T10:15:00',
    lastLogin: '2025-08-17T11:05:00',
    stats: {
      completedExercises: 94,
      avgAccuracy: 92,
      avgWPM: 68
    }
  },
  {
    id: 'usr_003',
    name: '박백엔드',
    email: 'backend.park@example.com',
    role: 'user',
    status: 'active',
    joinedAt: '2025-04-10T14:20:00',
    lastLogin: '2025-08-12T09:35:00',
    stats: {
      completedExercises: 67,
      avgAccuracy: 85,
      avgWPM: 62
    }
  },
  {
    id: 'usr_004',
    name: '최디자인',
    email: 'design.choi@example.com',
    role: 'premium',
    status: 'inactive',
    joinedAt: '2025-02-28T16:40:00',
    lastLogin: '2025-07-05T10:15:00',
    stats: {
      completedExercises: 32,
      avgAccuracy: 78,
      avgWPM: 55
    }
  },
  {
    id: 'usr_005',
    name: '정데이터',
    email: 'data.jung@example.com',
    role: 'user',
    status: 'suspended',
    joinedAt: '2025-05-19T11:25:00',
    lastLogin: '2025-07-30T16:45:00',
    stats: {
      completedExercises: 45,
      avgAccuracy: 89,
      avgWPM: 65
    }
  },
  {
    id: 'usr_006',
    name: '강인공지능',
    email: 'ai.kang@example.com',
    role: 'user',
    status: 'active',
    joinedAt: '2025-06-07T09:10:00',
    lastLogin: '2025-08-15T14:30:00',
    stats: {
      completedExercises: 57,
      avgAccuracy: 91,
      avgWPM: 72
    }
  },
  {
    id: 'usr_007',
    name: '윤클라우드',
    email: 'cloud.yoon@example.com',
    role: 'user',
    status: 'active',
    joinedAt: '2025-05-30T13:55:00',
    lastLogin: '2025-08-10T10:20:00',
    stats: {
      completedExercises: 48,
      avgAccuracy: 84,
      avgWPM: 58
    }
  },
  {
    id: 'usr_008',
    name: '한보안',
    email: 'security.han@example.com',
    role: 'premium',
    status: 'active',
    joinedAt: '2025-04-25T15:30:00',
    lastLogin: '2025-08-18T09:45:00',
    stats: {
      completedExercises: 82,
      avgAccuracy: 95,
      avgWPM: 71
    }
  },
  {
    id: 'usr_009',
    name: '송네트워크',
    email: 'network.song@example.com',
    role: 'user',
    status: 'inactive',
    joinedAt: '2025-06-12T10:40:00',
    lastLogin: '2025-08-01T11:30:00',
    stats: {
      completedExercises: 39,
      avgAccuracy: 81,
      avgWPM: 63
    }
  },
  {
    id: 'usr_010',
    name: '조모바일',
    email: 'mobile.jo@example.com',
    role: 'user',
    status: 'active',
    joinedAt: '2025-07-08T14:15:00',
    lastLogin: '2025-08-17T15:50:00',
    stats: {
      completedExercises: 31,
      avgAccuracy: 87,
      avgWPM: 66
    }
  }
])

// 페이지네이션 상태
const currentPage = ref(1)
const itemsPerPage = 5
const totalUsers = computed(() => users.value.length)
const totalPages = computed(() => Math.ceil(totalUsers.value / itemsPerPage))

// 필터링 상태
const filters = ref({
  role: '',
  status: '',
  search: ''
})

// 모달 상태
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const editingUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'user',
  status: 'active'
})
const editingIndex = ref(-1)
const showDeleteConfirm = ref(false)
const userToDelete = ref(null)
const deleteIndex = ref(-1)

// 알림 상태
const notification = ref({
  show: false,
  type: 'success', // success, error, info
  message: ''
})

// 필터링된 사용자 목록
const filteredUsers = computed(() => {
  // 필터링
  let result = users.value.filterß(user => {
    // 역할 필터
    if (filters.value.role && user.role !== filters.value.role) {
      return false
    }
    
    // 상태 필터
    if (filters.value.status && user.status !== filters.value.status) {
      return false
    }
    
    // 검색 필터
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      return (
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.id.toLowerCase().includes(searchTerm)
      )
    }
    
    return true
  })
  
  // 페이지네이션
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return result.slice(startIndex, endIndex)
})

// 필터 변경 시 첫 페이지로 돌아가기
watch(filters, () => {
  currentPage.value = 1
})

// 함수 정의
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('ko-KR', options)
}

function getRoleLabel(role) {
  const labels = {
    admin: '관리자',
    premium: '프리미엄',
    user: '일반 사용자'
  }
  return labels[role] || role
}

function getStatusLabel(status) {
  const labels = {
    active: '활성',
    inactive: '비활성',
    suspended: '정지'
  }
  return labels[status] || status
}

function getUserInitials(name) {
  if (!name) return '?'
  return name.charAt(0)
}

function getAvatarColor(name) {
  if (!name) return 'bg-gray-400'
  
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-primary-500'
  ]
  
  // 이름의 각 문자 코드를 더해 색상 결정
  const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return colors[charSum % colors.length]
}

function editUser(user, index) {
  // 기존 유저 정보를 깊은 복사하여 편집용 객체 생성
  editingUser.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  }
  editingIndex.value = index
  showEditUserModal.value = true
}

function confirmDeleteUser(user, index) {
  userToDelete.value = user
  deleteIndex.value = index
  showDeleteConfirm.value = true
}

function closeUserModal() {
  showAddUserModal.value = false
  showEditUserModal.value = false
  resetEditingUser()
}

function resetEditingUser() {
  editingUser.value = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  }
  editingIndex.value = -1
}

function saveUser() {
  if (showAddUserModal.value) {
    // 새 사용자 추가
    const newUser = {
      id: `usr_${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      name: editingUser.value.name,
      email: editingUser.value.email,
      role: editingUser.value.role,
      status: editingUser.value.status,
      joinedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      stats: {
        completedExercises: 0,
        avgAccuracy: 0,
        avgWPM: 0
      }
    }
    users.value.push(newUser)
    showNotification('success', '새 사용자가 추가되었습니다.')
  } else {
    // 기존 사용자 수정
    const currentPageOffset = (currentPage.value - 1) * itemsPerPage
    const actualIndex = currentPageOffset + editingIndex.value
    
    // 원본 객체의 레퍼런스 유지를 위한 개별 속성 업데이트
    users.value[actualIndex].name = editingUser.value.name
    users.value[actualIndex].email = editingUser.value.email
    users.value[actualIndex].role = editingUser.value.role
    users.value[actualIndex].status = editingUser.value.status
    
    showNotification('success', '사용자 정보가 업데이트되었습니다.')
  }
  
  closeUserModal()
}

function deleteUser() {
  const currentPageOffset = (currentPage.value - 1) * itemsPerPage
  const actualIndex = currentPageOffset + deleteIndex.value
  
  // 사용자 삭제
  users.value.splice(actualIndex, 1)
  showDeleteConfirm.value = false
  showNotification('info', '사용자가 삭제되었습니다.')
  
  // 페이지 조정 (현재 페이지의 항목이 모두 삭제된 경우)
  if (filteredUsers.value.length === 0 && currentPage.value > 1) {
    currentPage.value--
  }
}

function exportUserData() {
  // CSV 형식으로 변환
  const header = ['ID', '이름', '이메일', '역할', '상태', '가입일', '최근 로그인', '완료 연습', '평균 정확도', '평균 WPM']
  
  const csvContent = [
    header.join(','),
    ...users.value.map(user => [
      user.id,
      user.name,
      user.email,
      getRoleLabel(user.role),
      getStatusLabel(user.status),
      formatDate(user.joinedAt),
      formatDate(user.lastLogin),
      user.stats.completedExercises,
      user.stats.avgAccuracy + '%',
      user.stats.avgWPM
    ].join(','))
  ].join('\n')
  
  // 파일 다운로드
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', `users_export_${new Date().toISOString().slice(0, 10)}.csv`)
  link.click()
  
  showNotification('success', '사용자 데이터를 내보냈습니다.')
}

function showNotification(type, message) {
  notification.value = {
    show: true,
    type,
    message
  }
  
  // 3초 후 알림 숨기기
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}
</script>
