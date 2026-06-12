<template>
  <section class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
    <el-input
      v-model.trim="search"
      class="w-full lg:max-w-sm"
      clearable
      placeholder="Search posts"
      aria-label="Search posts"
    />

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
      <el-select
        v-model="tagIds"
        multiple
        filterable
        clearable
        collapse-tags
        collapse-tags-tooltip
        :loading="areTagsLoading"
        placeholder="Tags"
        aria-label="Filter by tags"
        class="w-full sm:w-64"
      >
        <el-option
          v-for="tag in tagOptions"
          :key="tag.id"
          :label="tag.name"
          :value="tag.id"
        />
      </el-select>

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
import { usePublicTagsQuery } from '../post.queries'

const search = defineModel<string>('search', { required: true })
const minCommentsCount = defineModel<number | undefined>('minCommentsCount')
const tagIds = defineModel<string[]>('tagIds', { required: true })
const sortQuery = defineModel<TPostSortQuery>('sortQuery', { required: true })

const { data: tags, isLoading: areTagsLoading } = usePublicTagsQuery({ search: undefined })
const tagOptions = computed(() => tags.value ?? [])
</script>
