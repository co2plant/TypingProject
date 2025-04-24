<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import typingContents from '@/data/typingContents.json'

const router = useRouter()

// 모든 콘텐츠에서 유니크한 카테고리 목록 추출
const categories = computed(() => {
    const uniqueCategories = new Set(typingContents.map(content => content.category))
    return Array.from(uniqueCategories)
})

// 카테고리 선택 시 해당 카테고리 콘텐츠 뷰로 이동
const selectCategory = (categoryName) => {
    // URL 인코딩을 통해 안전하게 파라미터 전달
    router.push({ name: 'category-content', params: { categoryName: encodeURIComponent(categoryName) } })
}
</script>

<template>
    <div class="category-selection">
        <h2>학습 카테고리 선택</h2>
        <ul>
            <li v-for="category in categories" :key="category" @click="selectCategory(category)">
                {{ category }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
.category-selection {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    padding: 1rem 1.2rem;
    margin-bottom: 0.8rem;
    border: 1px solid #eee;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
    font-size: 1.1rem;
    text-align: center;
}

li:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
}
</style>
