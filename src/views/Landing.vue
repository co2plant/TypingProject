<template>
  <div class="w-full mx-auto px-4 py-8">
    <div class="header">
      <h1>타자 연습</h1>
      <p class="subtitle">타자 속도와 정확도를 향상시키는 인터랙티브 타자 연습</p>
    </div>

    <div class="features">
      <div class="feature-card" @click="goToHome('q-cs-001')">
        <div class="feature-icon">⌨️</div>
        <h3>연습</h3>
        <p>다양한 타자 연습을 통해 실력을 향상시키세요</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">⏱️</div>
        <h3>시간 측정</h3>
        <p>분당 타자수(WPM)로 속도를 측정하세요</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>분석</h3>
        <p>정확도와 성능에 대한 상세한 피드백을 받으세요</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = (contentId) => {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.5;
}

h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 2rem 0 1.5rem;
  color: #333;
}

.content-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.content-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.content-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
}

.content-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.difficulty {
  color: #666;
}

.word-count {
  color: #4CAF50;
  font-weight: 500;
}

.content-preview {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.start-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 0;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
}

.start-btn:hover {
  background-color: #43a047;
}

@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .content-list {
    grid-template-columns: 1fr;
  }
}
</style>
