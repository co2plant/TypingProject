<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import typingContents from '@/data/typingContents.json'

const contents = ref(typingContents)
const router = useRouter()

const selectContent = (contentId) => {
    // 선택된 콘텐츠 ID를 사용하여 연습 화면으로 이동
    router.push({ name: 'practice', params: { contentId } })
}
</script>

<template>
    <div class="content-list">
        <h2>학습 콘텐츠 선택</h2>
        <ul>
            <li v-for="content in contents" :key="content.id" @click="selectContent(content.id)">
                {{ content.title }}
            </li>
        </ul>
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
</style>
