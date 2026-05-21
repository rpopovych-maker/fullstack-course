<template>
  <el-input
    v-model.trim="search"
    clearable
    placeholder="Search posts"
    aria-label="Search posts"
  />
</template>

<script lang="ts" setup>
const search = defineModel<string>({ required: true })
</script>
