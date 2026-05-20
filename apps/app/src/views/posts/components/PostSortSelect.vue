<template>
  <el-select
    v-model="selectedSort"
    aria-label="Sort posts"
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
type TPostSortValue = 'newest' | 'oldest' | 'mostCommented' | 'leastCommented' | 'titleAsc' | 'titleDesc'

interface IPostSortOption {
  label: string
  value: TPostSortValue
  query: TPostSortQuery
}

const defaultSortQuery: TPostSortQuery = { orderBy: 'createdAt', order: 'desc' }

const options: IPostSortOption[] = [
  {
    label: 'Newest first',
    value: 'newest',
    query: defaultSortQuery
  },
  {
    label: 'Oldest first',
    value: 'oldest',
    query: { orderBy: 'createdAt', order: 'asc' }
  },
  {
    label: 'Most commented',
    value: 'mostCommented',
    query: { orderBy: 'commentsCount', order: 'desc' }
  },
  {
    label: 'Least commented',
    value: 'leastCommented',
    query: { orderBy: 'commentsCount', order: 'asc' }
  },
  {
    label: 'Title A-Z',
    value: 'titleAsc',
    query: { orderBy: 'title', order: 'asc' }
  },
  {
    label: 'Title Z-A',
    value: 'titleDesc',
    query: { orderBy: 'title', order: 'desc' }
  }
]

const selectedSort = ref<TPostSortValue>('newest')
const selectedQuery = defineModel<TPostSortQuery>('query', { required: true })

watch(
  selectedSort,
  (value) => {
    selectedQuery.value = options.find(option => option.value === value)?.query ?? defaultSortQuery
  },
  { immediate: true }
)
</script>
