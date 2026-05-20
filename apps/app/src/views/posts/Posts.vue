<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <header class="flex items-center justify-between gap-4">
      <div class="space-y-1">
        <h1>Posts</h1>
        <p class="t-muted">Share what's on your mind.</p>
      </div>
      <el-button type="primary" @click="openModal('PostFormModal')">
        <span class="inline-flex items-center gap-1.5">
          <Icon name="plus" />
          New post
        </span>
      </el-button>
    </header>

    <section class="flex justify-end">
      <el-select
        v-model="selectedSort"
        class="w-full sm:w-64"
        aria-label="Sort posts"
      >
        <el-option
          v-for="option in sortOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </section>

    <PostSkeleton v-if="isLoading && !postsPage.data.length" />

    <el-empty
      v-else-if="!postsPage.data.length"
      description="No posts yet"
    >
      <el-button type="primary" @click="openModal('PostFormModal')">
        <span class="inline-flex items-center gap-1.5">
          <Icon name="plus" />
          Create the first post
        </span>
      </el-button>
    </el-empty>

    <div
      v-else
      class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    >
      <PostCard
        v-for="post in postsPage.data"
        :key="post.id"
        :post="post"
      />
    </div>

    <div v-if="postsPage.totalPages > 1" class="flex justify-center">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        background
        layout="sizes, prev, pager, next, total"
        :page-sizes="[6, 9, 12, 24]"
        :total="postsPage.total"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { openModal } = useModals()

const pagination = reactive({
  page: 1,
  pageSize: 9
})

type TPostSortValue = 'newest' | 'oldest' | 'mostCommented' | 'leastCommented' | 'alphabetical'
type TPostSortQuery = Pick<TPostListQuery, 'orderBy' | 'order'>

const defaultSortQuery: TPostSortQuery = { orderBy: 'createdAt', order: 'desc' }

const sortOptions: Array<{
  label: string
  value: TPostSortValue
  query: TPostSortQuery
}> = [
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
    label: 'Alphabetical',
    value: 'alphabetical',
    query: { orderBy: 'title', order: 'asc' }
  }
]

const selectedSort = ref<TPostSortValue>('newest')

const selectedSortQuery = computed(() => {
  return sortOptions.find(option => option.value === selectedSort.value)?.query ?? defaultSortQuery
})

const postsQueryParams = computed<TPostListQuery>(() => ({
  page: pagination.page,
  pageSize: pagination.pageSize,
  ...selectedSortQuery.value
}))

const { data: posts, isLoading } = usePostsQuery(postsQueryParams)

const postsPage = computed<TPostList>(() => {
  return posts.value ?? {
    data: [],
    page: pagination.page,
    pageSize: pagination.pageSize,
    total: 0,
    totalPages: 0
  }
})

watch(selectedSort, () => {
  pagination.page = 1
})
</script>
