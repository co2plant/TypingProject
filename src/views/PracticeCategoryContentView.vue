<template>
    <div>
        <ContentList :filter-category="categoryName" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ContentList from '@/components/ContentList.vue'

const route = useRoute()
const categoryName = ref('')

onMounted(() => {
    categoryName.value = decodeURIComponent(route.params.categoryName)
})
</script>
