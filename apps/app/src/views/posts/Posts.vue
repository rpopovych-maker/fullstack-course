<template>
  <div class="min-h-dvh max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
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

    <PostFilters
      v-model:search="searchTerm"
      v-model:min-comments-count="minCommentsCount"
      v-model:sort-query="sortQuery"
    />

    <div class="flex-1">
      <PostSkeleton v-if="isLoading && !postsPage.data.length" />

      <el-empty
        v-else-if="!postsPage.data.length"
        :description="emptyDescription"
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
    </div>

    <div v-if="postsPage.totalPages > 1" class="mt-auto flex justify-center pt-2">
      <el-pagination
        v-model:current-page="pagination.page"
        background
        layout="prev, pager, next, total"
        :page-size="pagination.pageSize"
        :total="postsPage.total"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { openModal } = useModals()
const route = useRoute()
const router = useRouter()

const pagination = reactive({
  page: readPageQuery(),
  pageSize: 9
})

const sortQuery = ref<TPostSortQuery>({ orderBy: 'createdAt', order: 'desc' })
const searchTerm = ref('')
const debouncedSearchTerm = refDebounced(searchTerm, 300)
const minCommentsCount = ref<number>()

const searchQuery = computed(() => {
  const trimmedSearch = debouncedSearchTerm.value.trim()

  return trimmedSearch.length >= 3 ? trimmedSearch : undefined
})

const minCommentsCountQuery = computed(() => {
  return minCommentsCount.value
})

const postsQueryParams = computed<TPostListQuery>(() => ({
  page: pagination.page,
  pageSize: pagination.pageSize,
  ...(searchQuery.value ? { search: searchQuery.value } : {}),
  ...(minCommentsCountQuery.value !== undefined ? { minCommentsCount: minCommentsCountQuery.value } : {}),
  ...sortQuery.value
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

const emptyDescription = computed(() => {
  return searchQuery.value || minCommentsCountQuery.value !== undefined
    ? 'No posts match your filters'
    : 'No posts yet'
})

watch(sortQuery, () => {
  pagination.page = 1
})

watch(searchTerm, () => {
  pagination.page = 1
})

watch(minCommentsCount, () => {
  pagination.page = 1
})

watch(
  () => route.query.page,
  () => {
    pagination.page = readPageQuery()
  }
)

watch(
  () => pagination.page,
  (page) => {
    const query = { ...route.query }

    if (page > 1) {
      query.page = String(page)
    } else {
      delete query.page
    }

    void router.replace({ query })
  }
)

function readPageQuery () {
  const rawPage = Array.isArray(route.query.page) ? route.query.page[0] : route.query.page
  const page = Number(rawPage)

  return Number.isInteger(page) && page > 0 ? page : 1
}
</script>
