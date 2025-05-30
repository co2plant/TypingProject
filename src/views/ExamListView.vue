<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary-600 mb-4">{{ decodedCategory }} 시험 목록</h1>
    <p class="text-gray-600 mb-8">원하는 시험을 선택하세요.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="exam in filteredExams"
        :key="exam.id"
        @click="selectExam(exam.id)"
        class="bg-white rounded-lg shadow-lg p-6 border-2 border-primary-200 hover:border-primary-500 transition-colors cursor-pointer"
      >
        <h2 class="text-xl font-bold text-primary-700 mb-2">{{ exam.title }}</h2>
        <p class="text-gray-600 mb-4">{{ exam.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">{{ exam.questions.length }}개의 문제</span>
          <button class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors">
            시험 시작
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <router-link 
        to="/exam-categories" 
        class="inline-block bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
      >
        카테고리 선택으로 돌아가기
      </router-link>
      
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
  name: 'ExamListView',
  props: {
    category: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      examData: examData
    };
  },
  computed: {
    decodedCategory() {
      return decodeURIComponent(this.category);
    },
    filteredExams() {
      // 선택한 카테고리에 해당하는 시험들만 필터링
      return this.examData.filter(exam => exam.category === this.decodedCategory);
    }
  },
  methods: {
    selectExam(examId) {
      // 선택한 시험으로 이동
      this.$router.push({ 
        name: 'exam', 
        params: { examId } 
      });
    }
  }
};
</script>
