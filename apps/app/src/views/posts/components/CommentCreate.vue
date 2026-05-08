<template>
  <div class="space-y-2">
    <el-input
      v-model="text"
      type="textarea"
      :rows="3"
      placeholder="Write a comment…"
    />
    <div class="flex justify-end">
      <el-button
        type="primary"
        :disabled="!text.trim()"
        @click="submit"
      >
        <span class="inline-flex items-center gap-1.5">
          <Icon name="send" />
          Post comment
        </span>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const props = defineProps<{
  postId: string
}>()

const text = ref('')
const createMutation = useCreateCommentMutation()

function submit () {
  const body = text.value.trim()
  if (!body) {
    return
  }
  const draft = body
  text.value = ''
  createMutation.mutateAsync({ postId: props.postId, body: { text: draft } }).catch(() => {
    text.value = draft
    ElMessage.error('Failed to post comment')
  })
}
</script>
