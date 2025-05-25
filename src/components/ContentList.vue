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
    <div class="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
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
            
            <ul class="space-y-2">
                <li 
                    v-for="content in categoryContents" 
                    :key="content.id" 
                    @click="selectContent(content.id)"
                    class="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-primary-300 transition-all"
                >
                    {{ content.title }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
</style>
