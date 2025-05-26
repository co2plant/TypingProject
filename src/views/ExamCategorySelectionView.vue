<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary-600 mb-8">시험 카테고리 선택</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in uniqueCategories"
        :key="category"
        @click="selectCategory(category)"
        class="bg-white rounded-lg shadow-lg p-6 border-2 border-primary-300 hover:border-primary-500 transition-colors cursor-pointer"
      >
        <h2 class="text-xl font-bold text-primary-700 mb-2">{{ category }}</h2>
        <p class="text-gray-600 mb-4">{{ getCategoryDescription(category) }}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">{{ getExamCount(category) }}개의 시험</span>
          <button class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors">
            선택
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 text-center">
      <router-link 
        to="/" 
        class="inline-block bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-2 rounded-md transition-colors"
      >
        홈으로 돌아가기
      </router-link>
    </div>
  </div>
</template>

<script>
import examData from '@/data/examData.json';

export default {
  name: 'ExamCategorySelectionView',
  data() {
    return {
      examData: examData
    };
  },
  computed: {
    uniqueCategories() {
      // 중복 없는 카테고리 목록 반환
      return [...new Set(this.examData.map(exam => exam.category))];
    }
  },
  methods: {
    selectCategory(category) {
      // 선택한 카테고리로 이동
      this.$router.push({ 
        name: 'exam-list', 
        params: { category: encodeURIComponent(category) } 
      });
    },
    getCategoryDescription(category) {
      const categoryDescriptions = {
        '컴퓨터 과학': '컴퓨터 과학의 기본 개념과 알고리즘에 대한 시험입니다.',
        '네트워크': '네트워크 프로토콜과 구조에 대한 시험입니다.',
        '프로그래밍': '다양한 프로그래밍 언어와 개념에 대한 시험입니다.'
      };
      
      return categoryDescriptions[category] || '이 카테고리에 대한 시험입니다.';
    },
    getExamCount(category) {
      // 해당 카테고리의 시험 수 계산
      return this.examData.filter(exam => exam.category === category).length;
    }
  }
};
</script>
