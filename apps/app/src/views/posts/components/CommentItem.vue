<template>
  <div class="rounded-md border border-(--el-border-color-lighter) p-4">
    <div class="flex items-start gap-3">
      <AuthorAvatar :username="comment.author.username" />

      <div class="min-w-0 flex-1 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="t-caption">{{ comment.author.username }} · {{ createdAgo }}</span>
          <div v-if="!isEditing" class="flex items-center gap-1">
            <el-button
              v-if="canEditComment"
              text
              size="small"
              @click="startEdit"
            >
              <span class="inline-flex items-center gap-1">
                <Icon name="edit" />
                Edit
              </span>
            </el-button>
            <el-button
              v-if="canDeleteComment && !isAdmin"
              text
              size="small"
              type="danger"
              :loading="softDeleteMutation.isLoading.value"
              @click="deleteComment('soft')"
            >
              <span class="inline-flex items-center gap-1">
                <Icon name="trash" />
                Delete
              </span>
            </el-button>
            <template v-if="canDeleteComment && isAdmin">
              <el-button
                text
                size="small"
                type="warning"
                :loading="softDeleteMutation.isLoading.value"
                @click="deleteComment('soft')"
              >
                Soft delete
              </el-button>
              <el-button
                text
                size="small"
                type="danger"
                :loading="hardDeleteMutation.isLoading.value"
                @click="deleteComment('hard')"
              >
                Hard delete
              </el-button>
            </template>
          </div>
        </div>

        <p v-if="!isEditing" class="t-body whitespace-pre-line wrap-break-word">
          {{ comment.text }}
        </p>

        <div v-else class="space-y-2">
          <el-input
            v-model.trim="draft"
            type="textarea"
            :rows="3"
            autofocus
            @keydown.esc="cancelEdit"
          />
          <div class="flex justify-end gap-2">
            <el-button size="small" @click="cancelEdit">Cancel</el-button>
            <el-button
              size="small"
              type="primary"
              @click="save"
            >
              Save
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/views/auth/auth.store'

const props = defineProps<{
  comment: TComment
  postId: string
}>()

const authStore = useAuthStore()
const isEditing = ref(false)
const draft = ref(props.comment.text)
const updateMutation = useUpdateCommentMutation()
const softDeleteMutation = useSoftDeleteCommentMutation()
const hardDeleteMutation = useHardDeleteCommentMutation()

const createdAgo = useTimeAgo(() => props.comment.createdAt)
const canEditComment = computed(() => authStore.hasPermission('update:comments', props.comment))
const canDeleteComment = computed(() => authStore.hasPermission('delete:comments', props.comment))
const isAdmin = computed(() => authStore.user?.role === 'admin')

function startEdit () {
  if (!canEditComment.value) {
    return
  }

  draft.value = props.comment.text
  isEditing.value = true
}

function cancelEdit () {
  isEditing.value = false
  draft.value = props.comment.text
}

function save () {
  if (!canEditComment.value) {
    cancelEdit()
    return
  }

  const text = draft.value
  if (!text || text === props.comment.text) {
    cancelEdit()
    return
  }
  isEditing.value = false
  updateMutation.mutateAsync({
    postId: props.postId,
    commentId: props.comment.id,
    body: { text }
  }).catch(() => {
    ElMessage.error('Failed to update comment')
  })
}

async function deleteComment (mode: 'soft' | 'hard') {
  if (!canDeleteComment.value) {
    return
  }

  try {
    await ElMessageBox.confirm(
      mode === 'hard'
        ? 'Hard delete this comment? It will be moved to the archive.'
        : 'Delete this comment?',
      mode === 'hard' ? 'Hard delete comment' : 'Delete comment',
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
    const mutation = mode === 'hard' ? hardDeleteMutation : softDeleteMutation
    await mutation.mutateAsync({
      postId: props.postId,
      commentId: props.comment.id
    })
    ElMessage.success(mode === 'hard' ? 'Comment hard deleted' : 'Comment deleted')
  } catch {
    ElMessage.error('Failed to delete comment')
  }
}
</script>
