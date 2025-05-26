<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="!started" class="text-center">
      <h1 class="text-3xl font-bold text-primary-600 mb-4">{{ exam.title }}</h1>
      <p class="text-gray-600 mb-8">{{ exam.description }}</p>
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h2 class="text-xl font-semibold mb-4">시험 안내</h2>
        <p class="mb-2">1. 먼저 타이핑 테스트를 완료해주세요.</p>
        <p class="mb-2">2. 이후 {{ exam.questions.length }}개의 객관식 문제가 제공됩니다.</p>
        <p class="mb-6">3. 타이핑 정확도와 퀴즈 점수를 합산하여 최종 점수가 계산됩니다.</p>
        
        <button 
          @click="startExam" 
          class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md transition-colors w-full"
        >
          시험 시작하기
        </button>
      </div>
    </div>
    
    <div v-else>
      <div v-if="examPhase === 'typing'" class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold text-primary-600 mb-4">타이핑 테스트</h2>
        
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div class="mb-4">
            <div class="text-lg leading-relaxed text-gray-700">
              <span 
                v-for="(char, index) in exam.typingContent" 
                :key="index" 
                :class="{
                  'bg-green-200': index < typedText.length && char === typedText[index],
                  'bg-red-200': index < typedText.length && char !== typedText[index],
                  'font-bold underline': index === typedText.length,
                }"
              >{{ char }}</span>
            </div>
          </div>
          
          <div>
            <textarea 
              ref="typingInput"
              v-model="typedText"
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-primary-500 focus:outline-none"
              rows="5"
              placeholder="여기에 텍스트를 입력하세요..."
              @input="checkTyping"
              :disabled="typingCompleted"
            ></textarea>
          </div>
          
          <div class="mt-4 flex justify-between text-sm">
            <div>
              <span class="font-semibold text-primary-600">진행률:</span> 
              {{ Math.floor((typedText.length / exam.typingContent.length) * 100) }}%
            </div>
            <div>
              <span class="font-semibold text-primary-600">정확도:</span>
              {{ typingAccuracy }}%
            </div>
            <div>
              <span class="font-semibold text-primary-600">경과 시간:</span>
              {{ formatTime(typingElapsedTime) }}
            </div>
          </div>
        </div>
        
        <div v-if="typingCompleted" class="text-center">
          <button 
            @click="startQuizPhase" 
            class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md transition-colors"
          >
            퀴즈로 계속하기
          </button>
        </div>
      </div>
      
      <div v-else-if="examPhase === 'quiz'" class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-primary-600 mb-4">퀴즈 ({{ currentQuestionIndex + 1 }} / {{ exam.questions.length }})</h2>
        
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">{{ currentQuestion.question }}</h3>
            
            <div class="space-y-3">
              <div 
                v-for="(option, index) in currentQuestion.options" 
                :key="index"
                @click="selectAnswer(option)"
                :class="[
                  'p-3 rounded-md cursor-pointer border-2 transition-colors',
                  selectedAnswer === option 
                    ? 'border-primary-500 bg-primary-100'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                ]"
              >
                <span>{{ option }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex justify-between items-center">
            <div>
              <span class="text-sm text-gray-500">경과 시간: {{ formatTime(quizElapsedTime) }}</span>
            </div>
            
            <button 
              @click="nextQuestion"
              :disabled="!selectedAnswer"
              :class="[
                'px-6 py-2 rounded-md text-white transition-colors',
                selectedAnswer
                  ? 'bg-primary-500 hover:bg-primary-600'
                  : 'bg-gray-400 cursor-not-allowed'
              ]"
            >
              {{ currentQuestionIndex === exam.questions.length - 1 ? '결과 보기' : '다음 문제' }}
            </button>
          </div>
        </div>
      </div>
      
      <div v-else-if="examPhase === 'completed'" class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-primary-600 mb-4">시험 완료!</h2>
        <p class="text-gray-600 mb-8">결과를 확인하세요.</p>
        
        <button 
          @click="showResult"
          class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md transition-colors w-full"
        >
          결과 보기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import examData from '@/data/examData.json';

export default {
  name: 'ExamView',
  props: {
    examId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      exam: null,
      started: false,
      examPhase: 'typing', // typing, quiz, completed
      
      // 타이핑 관련 데이터
      typedText: '',
      typingStartTime: null,
      typingEndTime: null,
      typingElapsedTime: 0,
      typingTimer: null,
      typingCompleted: false,
      typingAccuracy: 100,
      
      // 퀴즈 관련 데이터
      currentQuestionIndex: 0,
      selectedAnswer: '',
      quizStartTime: null,
      quizEndTime: null,
      quizElapsedTime: 0,
      quizTimer: null,
      userAnswers: [],
      correctAnswers: 0
    };
  },
  computed: {
    currentQuestion() {
      if (!this.exam || !this.exam.questions || this.currentQuestionIndex >= this.exam.questions.length) {
        return null;
      }
      return this.exam.questions[this.currentQuestionIndex];
    }
  },
  created() {
    // 선택한 시험 데이터 가져오기
    this.exam = examData.find(exam => exam.id === this.examId);
    
    if (!this.exam) {
      // 잘못된 시험 ID인 경우 카테고리 목록으로 리다이렉트
      this.$router.push({ name: 'exam-categories' });
    }
  },
  methods: {
    startExam() {
      this.started = true;
      this.typingStartTime = new Date();
      
      // 타이머 시작
      this.typingTimer = setInterval(() => {
        this.typingElapsedTime = Math.floor((new Date() - this.typingStartTime) / 1000);
      }, 1000);
      
      // 텍스트 영역에 포커스
      this.$nextTick(() => {
        this.$refs.typingInput.focus();
      });
    },
    
    checkTyping() {
      const text = this.exam.typingContent;
      const typed = this.typedText;
      
      // 정확도 계산
      let correctChars = 0;
      const minLength = Math.min(text.length, typed.length);
      
      for (let i = 0; i < minLength; i++) {
        if (text[i] === typed[i]) {
          correctChars++;
        }
      }
      
      this.typingAccuracy = typed.length > 0 
        ? Math.floor((correctChars / typed.length) * 100) 
        : 100;
      
      // 타이핑이 완료되었는지 확인
      if (typed.length >= text.length) {
        this.completeTypingPhase();
      }
    },
    
    completeTypingPhase() {
      // 타이핑 단계 완료
      this.typingCompleted = true;
      this.typingEndTime = new Date();
      clearInterval(this.typingTimer);
    },
    
    startQuizPhase() {
      this.examPhase = 'quiz';
      this.quizStartTime = new Date();
      
      // 퀴즈 타이머 시작
      this.quizTimer = setInterval(() => {
        this.quizElapsedTime = Math.floor((new Date() - this.quizStartTime) / 1000);
      }, 1000);
    },
    
    selectAnswer(option) {
      this.selectedAnswer = option;
    },
    
    nextQuestion() {
      // 사용자 답변 저장
      this.userAnswers.push({
        question: this.currentQuestion.question,
        userAnswer: this.selectedAnswer,
        correctAnswer: this.currentQuestion.answer,
        isCorrect: this.selectedAnswer === this.currentQuestion.answer
      });
      
      if (this.selectedAnswer === this.currentQuestion.answer) {
        this.correctAnswers++;
      }
      
      // 다음 질문으로
      if (this.currentQuestionIndex < this.exam.questions.length - 1) {
        this.currentQuestionIndex++;
        this.selectedAnswer = '';
      } else {
        this.completeExam();
      }
    },
    
    completeExam() {
      this.examPhase = 'completed';
      this.quizEndTime = new Date();
      clearInterval(this.quizTimer);
    },
    
    showResult() {
      // 결과 데이터 저장 및 결과 페이지로 이동
      const typingWPM = this.calculateWPM(
        this.exam.typingContent.length,
        this.typingElapsedTime
      );
      
      const resultData = {
        examId: this.examId,
        examTitle: this.exam.title,
        typing: {
          accuracy: this.typingAccuracy,
          wpm: typingWPM,
          elapsedTime: this.typingElapsedTime
        },
        quiz: {
          correctCount: this.correctAnswers,
          totalQuestions: this.exam.questions.length,
          score: Math.floor((this.correctAnswers / this.exam.questions.length) * 100),
          elapsedTime: this.quizElapsedTime,
          answers: this.userAnswers
        },
        totalScore: Math.floor(
          (this.typingAccuracy * 0.3) + 
          ((this.correctAnswers / this.exam.questions.length) * 100 * 0.7)
        )
      };
      
      // 결과 데이터를 로컬 스토리지에 임시 저장
      localStorage.setItem('examResult', JSON.stringify(resultData));
      
      // 결과 페이지로 이동
      this.$router.push({ name: 'exam-result' });
    },
    
    calculateWPM(charCount, seconds) {
      // 평균적으로 5글자를 1단어로 계산
      const words = charCount / 5;
      const minutes = seconds / 60;
      
      return Math.floor(words / minutes);
    },
    
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }
};
</script>
