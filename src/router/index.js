import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PracticeView from '../views/PracticeView.vue'
import PracticeCategorySelectionView from '../views/PracticeCategorySelectionView.vue'
import PracticeCategoryContentView from '../views/PracticeCategoryContentView.vue'
import PracticeResultView from '../views/PracticeResultView.vue'
import QuizView from '../views/QuizView.vue'
import QuizResultView from '../views/QuizResultView.vue'
import QuizCategorySelectionView from '../views/QuizCategorySelectionView.vue'
import QuizCategoryContentView from '../views/QuizCategoryContentView.vue'
import ExamCategorySelectionView from '../views/ExamCategorySelectionView.vue'
import ExamCategoryContentView from '../views/ExamCategoryContentView.vue'
import ExamView from '../views/ExamView.vue'
import ExamResultView from '../views/ExamResultView.vue'
import AdminView from '../views/AdminView.vue'
import AdminCategoryView from '../views/AdminCategoryView.vue'
import AdminExamView from '../views/AdminExamView.vue'
import AdminQuizView from '../views/AdminQuizView.vue'
import AdminTypingView from '../views/AdminTypingView.vue'

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
      name: 'practice-category-list',
      component: PracticeCategorySelectionView
    },
    {
      path: '/practice/categories/:categoryName',
      name: 'practice-category-content',
      component: PracticeCategoryContentView,
      props: true
    },
    {
      path: '/practice/:contentId',
      name: 'practice-content',
      component: PracticeView,
      props: true
    },
    {
      path: '/practice/result',
      name: 'practice-result',
      component: PracticeResultView
    },
    {
      path: '/quiz/categories',
      name: 'quiz-category-list',
      component: QuizCategorySelectionView  
    },
    {
      path: '/quiz/categories/:categoryName',
      name: 'quiz-category-content',
      component: QuizCategoryContentView,
      props: true
    },
    {
      path: '/quiz/:categoryName/:contentId',
      name: 'quiz-content',
      component: QuizView,
      props: true
    },
    {
      path: '/quiz/result',
      name: 'quiz-result',
      component: QuizResultView
    },
    {
      path: '/exam/categories',
      name: 'exam-category-list',
      component: ExamCategorySelectionView
    },
    {
      path: '/exam/categories/:categoryName',
      name: 'exam-category-content',
      component: ExamCategoryContentView,
      props: true
    },
    {
      path: '/exam/:categoryName/:contentId',
      name: 'exam-content',
      component: ExamView,
      props: true
    },
    {
      path: '/exam-result',
      name: 'exam-result',
      component: ExamResultView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/admin/categories',
      name: 'admin-categories',
      component: AdminCategoryView
    },
    {
      path: '/admin/exams',
      name: 'admin-exams',
      component: AdminExamView
    },
    {
      path: '/admin/quizzes',
      name: 'admin-quizzes',
      component: AdminQuizView
    },
    {
      path: '/admin/typing',
      name: 'admin-typing',
      component: AdminTypingView
    }
  ]
})

export default router
