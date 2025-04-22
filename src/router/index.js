import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PracticeView from '../views/PracticeView.vue'
import ResultView from '../views/ResultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      // 동적 세그먼트 :contentId 를 사용하여 특정 콘텐츠 연습 화면으로 이동
      path: '/practice/:contentId',
      name: 'practice',
      component: PracticeView,
      props: true, // 라우트 파라미터를 컴포넌트 props로 전달
    },
    {
      path: '/result',
      name: 'result',
      component: ResultView,
      // 결과 데이터는 query parameter로 전달되므로 props는 필요 없음
    },
  ],
})

export default router
