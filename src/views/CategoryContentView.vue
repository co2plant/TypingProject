<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ContentList from '@/components/ContentList.vue'

const route = useRoute()
const categoryName = ref('')

onMounted(() => {
    // URL 디코딩을 통해 원래 카테고리 이름 복원
    categoryName.value = decodeURIComponent(route.params.categoryName)
})
</script>

<template>
    <div>
        <!-- ContentList 컴포넌트에 필터링할 카테고리 이름 전달 -->
        <ContentList :filter-category="categoryName" />
    </div>
</template>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
