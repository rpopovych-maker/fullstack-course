<template>
  <div v-if="sortedComments.length" class="space-y-3">
    <CommentItem
      v-for="comment in sortedComments"
      :key="comment.id"
      :comment="comment"
      :post-id="postId"
    />
  </div>
  <p v-else class="t-muted">No comments yet — be the first.</p>
</template>

<script lang="ts" setup>
const props = defineProps<{
  comments: TComment[]
  postId: string
}>()

const sortedComments = computed(() => {
  return [...props.comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
})
</script>
