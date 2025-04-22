<script setup>
import { ref, computed } from 'vue' // computed 추가
import { useRouter } from 'vue-router'
import typingContents from '@/data/typingContents.json'

const contents = ref(typingContents)
const router = useRouter()

// 콘텐츠를 카테고리별로 그룹화하는 계산된 속성
const groupedContents = computed(() => {
    const groups = {}
    contents.value.forEach(content => {
    if (!groups[content.category]) {
      groups[content.category] = []
    }
    groups[content.category].push(content)
  })
  return groups
})

const selectContent = (contentId) => {
  router.push({ name: 'practice', params: { contentId } })
}
</script>

<template>
    <div class="content-list">
        <h2>학습 콘텐츠 선택</h2>
        <!-- 카테고리별 그룹 반복 -->
        <div v-for="(categoryContents, category) in groupedContents" :key="category" class="category-group">
            <h3>{{ category }}</h3>
            <ul>
                <!-- 해당 카테고리의 콘텐츠 목록 반복 -->
                <li v-for="content in categoryContents" :key="content.id" @click="selectContent(content.id)">
                    {{ content.title }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.content-list {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    padding: 0.8rem 1rem;
    margin-bottom: 0.5rem;
    border: 1px solid #eee;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

li:hover {
    background-color: #f0f0f0;
}
.category-group {
  margin-bottom: 2rem;
}

h3 {
  margin-bottom: 0.8rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #eee;
  font-size: 1.3rem;
  color: #333;
}
</style>
