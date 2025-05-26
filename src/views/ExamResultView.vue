<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="resultData">
      <h1 class="text-3xl font-bold text-primary-600 mb-2">시험 결과</h1>
      <h2 class="text-xl text-gray-600 mb-8">{{ resultData.examTitle }}</h2>
      
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-primary-700">종합 점수</h3>
          <div class="text-4xl font-bold" :class="getScoreColorClass(resultData.totalScore)">
            {{ resultData.totalScore }}점
          </div>
        </div>
        
        <div class="h-4 bg-gray-200 rounded-full mb-6">
          <div 
            class="h-4 rounded-full" 
            :class="getScoreColorClass(resultData.totalScore)"
            :style="{ width: `${resultData.totalScore}%` }"
          ></div>
        </div>
        
        <div class="text-sm text-gray-500 text-right">
          타이핑 정확도 30% + 퀴즈 점수 70%
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <!-- 타이핑 결과 -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-bold text-primary-700 mb-4">타이핑 결과</h3>
          
          <div class="flex flex-col space-y-4">
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-gray-600">정확도</span>
                <span class="font-semibold" :class="getScoreColorClass(resultData.typing.accuracy)">
                  {{ resultData.typing.accuracy }}%
                </span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full">
                <div 
                  class="h-2 rounded-full" 
                  :class="getScoreColorClass(resultData.typing.accuracy)"
                  :style="{ width: `${resultData.typing.accuracy}%` }"
                ></div>
              </div>
            </div>
            
            <div class="flex justify-between">
              <div>
                <div class="text-gray-600 mb-1">타이핑 속도</div>
                <div class="text-2xl font-semibold">{{ resultData.typing.wpm }} <span class="text-sm text-gray-500">WPM</span></div>
              </div>
              
              <div>
                <div class="text-gray-600 mb-1">소요 시간</div>
                <div class="text-2xl font-semibold">{{ formatTime(resultData.typing.elapsedTime) }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 퀴즈 결과 -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-bold text-primary-700 mb-4">퀴즈 결과</h3>
          
          <div class="flex flex-col space-y-4">
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-gray-600">정답률</span>
                <span class="font-semibold" :class="getScoreColorClass(resultData.quiz.score)">
                  {{ resultData.quiz.score }}%
                </span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full">
                <div 
                  class="h-2 rounded-full" 
                  :class="getScoreColorClass(resultData.quiz.score)"
                  :style="{ width: `${resultData.quiz.score}%` }"
                ></div>
              </div>
            </div>
            
            <div class="flex justify-between">
              <div>
                <div class="text-gray-600 mb-1">맞은 문제</div>
                <div class="text-2xl font-semibold">
                  {{ resultData.quiz.correctCount }}/{{ resultData.quiz.totalQuestions }}
                </div>
              </div>
              
              <div>
                <div class="text-gray-600 mb-1">소요 시간</div>
                <div class="text-2xl font-semibold">{{ formatTime(resultData.quiz.elapsedTime) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 퀴즈 답변 세부 내용 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 class="text-xl font-bold text-primary-700 mb-4">퀴즈 상세 결과</h3>
        
        <div class="space-y-4">
          <div 
            v-for="(answer, index) in resultData.quiz.answers" 
            :key="index"
            class="p-4 rounded-lg"
            :class="answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'"
          >
            <div class="font-semibold mb-2">{{ index + 1 }}. {{ answer.question }}</div>
            
            <div class="flex flex-col space-y-2">
              <div class="flex items-start">
                <span class="text-gray-600 w-32">내 답변:</span>
                <span 
                  :class="answer.isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'"
                >
                  {{ answer.userAnswer }}
                </span>
              </div>
              
              <div v-if="!answer.isCorrect" class="flex items-start">
                <span class="text-gray-600 w-32">정답:</span>
                <span class="text-green-600 font-medium">{{ answer.correctAnswer }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-between">
        <router-link 
          :to="`/exam/${resultData.examId}`" 
          class="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          다시 시험보기
        </router-link>
        
        <router-link 
          to="/exam-categories" 
          class="inline-block bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          다른 시험 선택하기
        </router-link>
      </div>
    </div>
    
    <div v-else class="text-center py-16">
      <div class="text-2xl text-gray-500 mb-6">결과 데이터를 찾을 수 없습니다.</div>
      <router-link 
        to="/exam-categories" 
        class="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md transition-colors"
      >
        시험 선택하기
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamResultView',
  data() {
    return {
      resultData: null
    };
  },
  created() {
    // 로컬 스토리지에서 시험 결과 데이터 가져오기
    const storedResult = localStorage.getItem('examResult');
    
    if (storedResult) {
      this.resultData = JSON.parse(storedResult);
    }
  },
  methods: {
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    getScoreColorClass(score) {
      if (score >= 90) return 'text-green-600';
      if (score >= 70) return 'text-primary-600';
      if (score >= 50) return 'text-yellow-600';
      return 'text-red-600';
    }
  }
};
</script>
