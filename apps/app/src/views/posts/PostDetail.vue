<template>
  <div class="max-w-3xl mx-auto px-4 py-8 space-y-8">
    <div>
      <router-link
        :to="{ name: routeNames.posts, query: route.query }"
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
        <router-link :to="{ name: routeNames.posts, query: route.query }">
          <el-button type="primary">Back to posts</el-button>
        </router-link>
      </template>
    </el-result>

    <template v-else-if="post">
      <article class="space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex min-w-0 items-start gap-3">
            <AuthorAvatar :username="post.author.username" :size="40" />
            <div class="space-y-1 min-w-0">
              <h1 class="wrap-break-word">{{ post.title }}</h1>
              <p class="t-caption">{{ post.author.username }} · {{ createdAgo }}</p>
            </div>
          </div>
          <div v-if="canEditPost || canDeletePost" class="flex items-center gap-2">
            <el-button
              v-if="canEditPost"
              text
              @click="openEditModal"
            >
              <span class="inline-flex items-center gap-1">
                <Icon name="edit" />
                Edit
              </span>
            </el-button>
            <el-button
              v-if="canDeletePost && !isAdmin"
              text
              type="danger"
              :loading="softDeletePostMutation.isLoading.value"
              @click="deletePost('soft')"
            >
              <span class="inline-flex items-center gap-1">
                <Icon name="trash" />
                Delete
              </span>
            </el-button>
            <template v-if="canDeletePost && isAdmin">
              <el-button
                text
                type="warning"
                :loading="softDeletePostMutation.isLoading.value"
                @click="deletePost('soft')"
              >
                Soft delete
              </el-button>
              <el-button
                text
                type="danger"
                :loading="hardDeletePostMutation.isLoading.value"
                @click="deletePost('hard')"
              >
                Hard delete
              </el-button>
            </template>
          </div>
        </div>

        <p v-if="post.description" class="t-body whitespace-pre-line wrap-break-word">
          {{ post.description }}
        </p>

        <div v-if="post.tags.length" class="flex flex-wrap gap-2">
          <el-tag
            v-for="tag in post.tags"
            :key="tag.id"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </article>

      <el-divider />

      <section class="space-y-6">
        <h2 class="inline-flex items-center gap-2">
          <Icon name="chat" />
          {{ commentsHeading }}
        </h2>

        <div v-if="areCommentsLoading && !flatComments.length" class="space-y-3">
          <div
            v-for="n in 2"
            :key="n"
            class="rounded-md border border-zinc-800 p-4"
          >
            <el-skeleton :rows="2" animated />
          </div>
        </div>

        <el-alert
          v-else-if="commentsError && !flatComments.length"
          title="Comments could not be loaded"
          type="error"
          show-icon
          :closable="false"
        />

        <template v-else>
          <CommentList :comments="flatComments" :post-id="post.id" />

          <div
            v-if="hasNextCommentsPage || areMoreCommentsLoading"
            ref="commentsLoadMoreTarget"
            class="min-h-10"
          >
            <div v-if="areMoreCommentsLoading" class="space-y-3">
              <div class="rounded-md border border-zinc-800 p-4">
                <el-skeleton :rows="2" animated />
              </div>
            </div>
          </div>

          <el-alert
            v-if="commentsError && flatComments.length"
            title="More comments could not be loaded"
            type="error"
            show-icon
            :closable="false"
          />
        </template>
        <CommentCreate :post-id="post.id" />
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { AxiosError } from 'axios'
import pluralize from 'pluralize'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { hasPermission } = usePermissions()
const postId = computed(() => route.params.postId as string)

const { data: post, isLoading, error } = usePostQuery(postId)
const {
  data: comments,
  isLoading: areCommentsLoading,
  error: commentsError,
  hasNextPage: hasNextCommentsPage,
  loadNextPage: loadNextCommentsPage
} = usePostCommentsQuery(postId)
const { openModal } = useModals()
const softDeletePostMutation = useSoftDeletePostMutation()
const hardDeletePostMutation = useHardDeletePostMutation()
const commentsLoadMoreTarget = ref<HTMLElement | null>(null)
const areMoreCommentsLoading = ref(false)

const isNotFound = computed(() => {
  const err = error.value as AxiosError | null
  return err?.response?.status === 404
})

const createdAgo = useTimeAgo(() => post.value?.createdAt ?? '')
const flatComments = computed(() => comments.value?.pages.flatMap(page => page.data) ?? [])
const commentsHeading = computed(() => pluralize('Comment', flatComments.value.length, true))
const canEditPost = computed(() => post.value ? hasPermission('update:posts', post.value) : false)
const canDeletePost = computed(() => {
  return post.value ? hasPermission('delete:posts', post.value) : false
})
const isAdmin = computed(() => authStore.user?.role === 'admin')

useIntersectionObserver(
  commentsLoadMoreTarget,
  ([entry]) => {
    if (entry?.isIntersecting) {
      loadMoreComments()
    }
  },
  { rootMargin: '240px 0px' }
)

async function loadMoreComments () {
  if (!hasNextCommentsPage.value || areMoreCommentsLoading.value) {
    return
  }

  areMoreCommentsLoading.value = true
  try {
    await loadNextCommentsPage({ cancelRefetch: false })
  } finally {
    areMoreCommentsLoading.value = false
  }
}

function openEditModal () {
  if (!post.value || !canEditPost.value) {
    return
  }
  openModal('PostFormModal', {
    post: {
      id: post.value.id,
      title: post.value.title,
      description: post.value.description ?? '',
      tags: post.value.tags
    }
  })
}

async function deletePost (mode: 'soft' | 'hard') {
  if (!post.value || !canDeletePost.value) {
    return
  }

  try {
    await ElMessageBox.confirm(
      mode === 'hard'
        ? `Hard delete "${post.value.title}"? It will be moved to the archive.`
        : `Delete "${post.value.title}"?`,
      mode === 'hard' ? 'Hard delete post' : 'Delete post',
      {
        confirmButtonText: mode === 'hard' ? 'Hard delete' : 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
  } catch {
    return
  }

  try {
    const mutation = mode === 'hard' ? hardDeletePostMutation : softDeletePostMutation
    await mutation.mutateAsync(post.value.id)
    ElMessage.success(mode === 'hard' ? 'Post hard deleted' : 'Post deleted')
    await router.push({ name: routeNames.posts })
  } catch {
    ElMessage.error('Failed to delete post')
  }
}
</script>
