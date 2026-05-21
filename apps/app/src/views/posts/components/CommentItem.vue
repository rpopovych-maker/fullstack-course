<template>
  <div class="rounded-md border border-(--el-border-color-lighter) p-4">
    <div class="flex items-start gap-3">
      <AuthorAvatar :user-id="comment.userId" />

      <div class="min-w-0 flex-1 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="t-caption">{{ createdAgo }}</span>
          <el-button
            v-if="!isEditing"
            text
            size="small"
            @click="startEdit"
          >
            <span class="inline-flex items-center gap-1">
              <Icon name="edit" />
              Edit
            </span>
          </el-button>
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
import { ElMessage } from 'element-plus'

const props = defineProps<{
  comment: TComment
  postId: string
}>()

const isEditing = ref(false)
const draft = ref(props.comment.text)
const updateMutation = useUpdateCommentMutation()

const createdAgo = useTimeAgo(() => props.comment.createdAt)

function startEdit () {
  draft.value = props.comment.text
  isEditing.value = true
}

function cancelEdit () {
  isEditing.value = false
  draft.value = props.comment.text
}

function save () {
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
</script>
