<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary-600 mb-8">관리자 페이지</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <router-link 
        to="/admin/categories"
        class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div class="text-4xl mb-4 text-center">📁</div>
        <h3 class="text-xl font-semibold text-primary-600 mb-2 text-center">카테고리 관리</h3>
        <p class="text-gray-600 text-center">카테고리 추가, 수정, 삭제</p>
      </router-link>
      
      <router-link 
        to="/admin/exams"
        class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div class="text-4xl mb-4 text-center">🎓</div>
        <h3 class="text-xl font-semibold text-primary-600 mb-2 text-center">시험 관리</h3>
        <p class="text-gray-600 text-center">시험 데이터 관리</p>
      </router-link>
      
      <router-link 
        to="/admin/quizzes"
        class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div class="text-4xl mb-4 text-center">❓</div>
        <h3 class="text-xl font-semibold text-primary-600 mb-2 text-center">퀴즈 관리</h3>
        <p class="text-gray-600 text-center">퀴즈 데이터 관리</p>
      </router-link>
      
      <router-link 
        to="/admin/typing"
        class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div class="text-4xl mb-4 text-center">⌨️</div>
        <h3 class="text-xl font-semibold text-primary-600 mb-2 text-center">타이핑 콘텐츠 관리</h3>
        <p class="text-gray-600 text-center">타이핑 연습 콘텐츠 관리</p>
      </router-link>
    </div>
    
    <div class="mt-8 text-center">
      <router-link 
        to="/"
        class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
      >
        홈으로 돌아가기
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>