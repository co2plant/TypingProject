<script setup>
import { ref, computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import typingContents from '@/data/typingContents.json'

const props = defineProps({
    filterCategory: {
        type: String,
        default: null
    }
})

const contents = ref(typingContents)
const router = useRouter()

const groupedContents = computed(() => {
    const groups = {}
    const filteredContents = props.filterCategory
        ? contents.value.filter(content => content.category === props.filterCategory)
        : contents.value

    filteredContents.forEach(content => {
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
    <div class="container mx-auto px-4 py-8">
        <h2 class="text-center mb-12 text-4xl font-bold text-primary-700">
            {{ props.filterCategory ? `${props.filterCategory} 학습 콘텐츠` : '학습 콘텐츠 선택' }}
        </h2>
        
        <div 
            v-for="(categoryContents, category) in groupedContents" 
            :key="category || 'filtered'"
            class="mb-8 last:mb-0"
        >
            <h3 
                v-if="!props.filterCategory" 
                class="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-700"
            >
                {{ category }}
            </h3>
            
            <ul class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <li 
                    v-for="content in categoryContents" 
                    :key="content.id" 
                    @click="selectContent(content.id)"
                    class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                >
                    {{ content.title }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
</style>
