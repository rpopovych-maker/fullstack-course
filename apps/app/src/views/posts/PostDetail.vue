<template>
  <div class="max-w-3xl mx-auto px-4 py-8 space-y-8">
    <div>
      <router-link
        :to="{ name: routeNames.posts }"
        class="t-label inline-flex items-center gap-1.5 hover:underline"
      >
        <Icon name="arrow-left" />
        Back to posts
      </router-link>
    </div>

    <PostDetailSkeleton v-if="isLoading && !post" />

    <el-result
      v-else-if="isNotFound"
      icon="warning"
      title="Post not found"
      sub-title="It may have been removed or the link is incorrect."
    >
      <template #extra>
        <router-link :to="{ name: routeNames.posts }">
          <el-button type="primary">Back to posts</el-button>
        </router-link>
      </template>
    </el-result>

    <template v-else-if="post">
      <article class="space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1 min-w-0">
            <h1 class="wrap-break-word">{{ post.title }}</h1>
            <p class="t-caption">{{ createdAgo }}</p>
          </div>
          <el-button text @click="openEditModal">
            <span class="inline-flex items-center gap-1">
              <Icon name="edit" />
              Edit
            </span>
          </el-button>
        </div>

        <p v-if="post.description" class="t-body whitespace-pre-line wrap-break-word">
          {{ post.description }}
        </p>
      </article>

      <el-divider />

      <section class="space-y-6">
        <h2 class="inline-flex items-center gap-2">
          <Icon name="chat" />
          {{ commentsHeading }}
        </h2>

        <div v-if="areCommentsLoading && !commentsPage.data.length" class="space-y-3">
          <div
            v-for="n in 2"
            :key="n"
            class="rounded-md border border-(--el-border-color-lighter) p-4"
          >
            <el-skeleton :rows="2" animated />
          </div>
        </div>

        <el-alert
          v-else-if="commentsError"
          title="Comments could not be loaded"
          type="error"
          show-icon
          :closable="false"
        />

        <CommentList v-else :comments="commentsPage.data" :post-id="post.id" />
        <CommentCreate :post-id="post.id" />
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { AxiosError } from 'axios'
import pluralize from 'pluralize'

const route = useRoute()
const postId = computed(() => route.params.postId as string)

const { data: post, isLoading, error } = usePostQuery(postId)
const {
  data: comments,
  isLoading: areCommentsLoading,
  error: commentsError
} = usePostCommentsQuery(postId)
const { openModal } = useModals()

const isNotFound = computed(() => {
  const err = error.value as AxiosError | null
  return err?.response?.status === 404
})

const createdAgo = useTimeAgo(() => post.value?.createdAt ?? '')
const commentsPage = computed<TPostComments>(() => comments.value ?? { data: [], nextCursor: null })
const commentsHeading = computed(() => pluralize('Comment', commentsPage.value.data.length, true))

function openEditModal () {
  if (!post.value) {
    return
  }
  openModal('PostFormModal', {
    post: {
      id: post.value.id,
      title: post.value.title,
      description: post.value.description ?? ''
    }
  })
}
</script>
