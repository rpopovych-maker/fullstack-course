<template>
  <section class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
    <SearchInput
      v-model="search"
      class="w-full lg:max-w-sm"
    />

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto">
      <el-input-number
        v-model="minCommentsCount"
        class="w-full sm:w-56"
        :min="0"
        :step="1"
        step-strictly
        placeholder="Min comments"
        aria-label="Minimum comments"
        :value-on-clear="undefined"
      />

      <PostSortSelect
        v-model:query="sortQuery"
        class="w-full sm:w-64"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
const search = defineModel<string>('search', { required: true })
const minCommentsCount = defineModel<number | undefined>('minCommentsCount')
const sortQuery = defineModel<TPostSortQuery>('sortQuery', { required: true })
</script>
