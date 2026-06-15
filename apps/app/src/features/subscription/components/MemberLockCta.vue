<template>
  <div class="member-lock space-y-4 rounded-xl p-6">
    <p
      v-if="preview"
      class="t-body whitespace-pre-line wrap-break-word"
    >
      {{ preview }}
    </p>

    <div class="flex items-start gap-3">
      <span class="member-lock__icon inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        <Icon name="lock" />
      </span>
      <div class="space-y-1">
        <h3>This post is for members</h3>
        <p class="t-body-sm">
          Subscribe to Pro to read the full post and join the conversation.
        </p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <router-link
        #default="{ navigate }"
        :to="{ name: routeNames.pricing }"
        custom
      >
        <el-button type="primary" @click="navigate">
          Subscribe to read
        </el-button>
      </router-link>
      <span class="t-caption">Cancel anytime.</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  preview?: string | null
}>()
</script>

<style scoped>
.member-lock {
  background-image: linear-gradient(
    135deg,
    rgba(250, 204, 21, 0.08) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(250, 204, 21, 0.25);
}

.member-lock__icon {
  background-color: rgba(250, 204, 21, 0.14);
  color: rgb(250, 204, 21);
}
</style>
