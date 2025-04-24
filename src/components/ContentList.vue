<script setup>
import { ref, computed, defineProps } from 'vue' // defineProps 추가
import { useRouter } from 'vue-router'
import typingContents from '@/data/typingContents.json'

// filterCategory prop 정의
const props = defineProps({
    filterCategory: {
        type: String,
        default: null
    }
})

const contents = ref(typingContents)
const router = useRouter()

// 콘텐츠를 카테고리별로 그룹화하거나, 특정 카테고리만 필터링
const groupedContents = computed(() => {
    const groups = {}
    const filteredContents = props.filterCategory
        ? contents.value.filter(content => content.category === props.filterCategory)
        : contents.value

    filteredContents.forEach(content => {
        // filterCategory가 있으면 모든 콘텐츠를 단일 그룹('' 키)으로 묶거나,
        // 없으면 기존처럼 카테고리별로 그룹화
        const groupKey = props.filterCategory ? '' : content.category
        if (!groups[groupKey]) {
            groups[groupKey] = []
        }
        groups[groupKey].push(content)
    })
    return groups
})

const selectContent = (contentId) => {
    router.push({ name: 'practice', params: { contentId } })
}
</script>

<template>
    <div class="content-list">
        <!-- filterCategory가 있으면 해당 카테고리 이름 표시, 없으면 전체 목록 제목 표시 -->
        <h2>{{ props.filterCategory ? `${props.filterCategory} 학습 콘텐츠` : '학습 콘텐츠 선택' }}</h2>
        <!-- 카테고리별 그룹 반복 (filterCategory가 있으면 그룹은 하나) -->
        <div v-for="(categoryContents, category) in groupedContents" :key="category || 'filtered'"
            class="category-group">
            <!-- filterCategory가 없을 때만 카테고리 제목 표시 -->
            <h3 v-if="!props.filterCategory">{{ category }}</h3>
            <ul>
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
