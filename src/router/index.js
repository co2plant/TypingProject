import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PracticeView from '../views/PracticeView.vue'
import ResultView from '../views/ResultView.vue'
import CategorySelectionView from '../views/CategorySelectionView.vue' // 추가
import CategoryContentView from '../views/CategoryContentView.vue' // 추가
import QuizView from '../views/QuizView.vue'
import QuizResultView from '../views/QuizResultView.vue'
import QuizCategorySelectionView from '../views/QuizCategorySelectionView.vue' // 추가
import ExamCategorySelectionView from '../views/ExamCategorySelectionView.vue'
import ExamListView from '../views/ExamListView.vue'
import ExamView from '../views/ExamView.vue'
import ExamResultView from '../views/ExamResultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/categories',
      name: 'category-selection',
      component: CategorySelectionView
    },
    {
      // 특정 카테고리의 콘텐츠 목록 페이지 경로
      path: '/category/:categoryName',
      name: 'category-content',
      component: CategoryContentView,
      props: true // 라우트 파라미터 categoryName을 props로 전달
    },
    {
      path: '/practice/:contentId',
      name: 'practice',
      component: PracticeView,
      props: true
    },
    {
      path: '/result',
      name: 'result',
      component: ResultView
    },
    {
      path: '/quiz/:contentId',
      name: 'quiz',
      component: QuizView,
      props: true
    },
    {
      path: '/quiz-result',
      name: 'quiz-result',
      component: QuizResultView
    },
    {
      path: '/quizCategorySelection',
      name: 'quiz-category-selection',
      component: QuizCategorySelectionView
    },
    {
      path: '/exam-categories',
      name: 'exam-categories',
      component: ExamCategorySelectionView
    },
    {
      path: '/exam-list/:category',
      name: 'exam-list',
      component: ExamListView,
      props: true
    },
    {
      path: '/exam/:examId',
      name: 'exam',
      component: ExamView,
      props: true
    },
    {
      path: '/exam-result',
      name: 'exam-result',
      component: ExamResultView
    }
  ]
})

export default router
