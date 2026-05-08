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

    <PostSkeleton v-if="isLoading && !sortedPosts.length" />

    <el-empty
      v-else-if="!sortedPosts.length"
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
        v-for="post in sortedPosts"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data: posts, isLoading } = usePostsQuery()
const { openModal } = useModals()

const sortedPosts = computed(() => {
  return [...(posts.value ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})
</script>
