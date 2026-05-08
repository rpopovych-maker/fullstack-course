<template>
  <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    <el-card v-for="n in count" :key="n" shadow="never">
      <el-skeleton :rows="3" animated />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
const { count = 6 } = defineProps<{
  count?: number
}>()
</script>
