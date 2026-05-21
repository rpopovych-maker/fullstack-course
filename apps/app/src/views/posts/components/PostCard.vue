<template>
  <router-link
    :to="{ name: routeNames.postDetail, params: { postId: post.id }, query: route.query }"
    class="post-card group flex h-full flex-col gap-3 rounded-xl p-5"
  >
    <div class="flex items-start gap-3">
      <AuthorAvatar :user-id="post.userId" />
      <div class="min-w-0 flex-1 space-y-2">
        <h3 class="line-clamp-2 wrap-break-word">{{ post.title }}</h3>
        <span class="t-caption">{{ createdAgo }}</span>
      </div>
    </div>

    <p
      v-if="post.description"
      class="t-body-sm line-clamp-3 wrap-break-word"
    >
      {{ post.description }}
    </p>

    <div class="mt-auto flex justify-end pt-2">
      <span class="post-card__tag inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 t-caption">
        <Icon name="chat" />
        {{ post.commentsCount }}
      </span>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
const props = defineProps<{
  post: TPostListItem
}>()

const route = useRoute()
const createdAgo = useTimeAgo(() => props.post.createdAt)
</script>

<style scoped>
.post-card {
  background-color: rgba(255, 255, 255, 0.04);
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.07) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.post-card:hover {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 14px 36px rgba(0, 0, 0, 0.4);
}

.post-card__tag {
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
