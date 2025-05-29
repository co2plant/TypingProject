<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import typingContents from '@/data/typingContents.json'

const router = useRouter()

const categories = computed(() => {
    const uniqueCategories = new Set(typingContents.map(content => content.category))
    return Array.from(uniqueCategories)
})

const selectCategory = (categoryName) => {
    router.push({ name: 'category-content', params: { categoryName: encodeURIComponent(categoryName) } })
}
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <h2 class="text-center mb-12 text-4xl font-bold text-primary-700">학습 카테고리 선택</h2>
        <ul class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <li class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" v-for="category in categories" :key="category" @click="selectCategory(category)">
                {{ category }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
</style>
