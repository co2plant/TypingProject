import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PracticeView from '../views/PracticeView.vue'
import PracticeCategorySelectionView from '../views/PracticeCategorySelectionView.vue'
import PracticeCategoryContentView from '../views/PracticeCategoryContentView.vue'
import ResultView from '../views/ResultView.vue'
import QuizView from '../views/QuizView.vue'
import QuizResultView from '../views/QuizResultView.vue'
import QuizCategorySelectionView from '../views/QuizCategorySelectionView.vue'
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
      path: '/practice/categories',
      name: 'category-selection',
      component: PracticeCategorySelectionView
    },
    {
      path: '/practice/categories/:categoryName',
      name: 'category-content',
      component: PracticeCategoryContentView,
      props: true
    },
    {
      path: '/practice/:contentId',
      name: 'practice',
      component: PracticeView,
      props: true
    },
    {
      path: '/practice/result',
      name: 'practice-result',
      component: ResultView
    },
    {
      path: '/quiz/:contentId',
      name: 'quiz',
      component: QuizView,
      props: true
    },
    {
      path: '/quiz/result',
      name: 'quiz-result',
      component: QuizResultView
    },
    {
      path: '/quiz/categories',
      name: 'quiz-category-selection',
      component: QuizCategorySelectionView  
    },
    {
      path: '/exam/categories',
      name: 'exam-category-selection',
      component: ExamCategorySelectionView
    },
    {
      path: '/exam/:categories',
      name: 'exam-list',
      component: ExamListView,
      props: true
    },
    {
      path: '/exam/:contentId',
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
