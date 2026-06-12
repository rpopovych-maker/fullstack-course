<template>
  <el-table
    v-loading="loading"
    :data="tags"
    stripe
    height="100%"
    class="h-full rounded-md"
    empty-text="No tags match your filters"
  >
    <el-table-column prop="name" label="Name" min-width="240">
      <template #default="{ row }: { row: TTag }">
        <span class="t-body wrap-break-word">{{ row.name }}</span>
      </template>
    </el-table-column>

    <el-table-column label="Created" width="160">
      <template #default="{ row }: { row: TTag }">
        <span class="t-caption">{{ filters.formatDate(row.createdAt) }}</span>
      </template>
    </el-table-column>

    <el-table-column label="Actions" width="160" align="right">
      <template #default="{ row }: { row: TTag }">
        <div class="flex justify-end gap-2">
          <el-button
            size="small"
            aria-label="Edit tag"
            @click="$emit('edit', row)"
          >
            <Icon name="edit" />
          </el-button>
          <el-button
            size="small"
            type="danger"
            aria-label="Delete tag"
            :loading="pendingDeleteTagId === row.id"
            @click="$emit('delete', row)"
          >
            <Icon name="trash" />
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
defineProps<{
  tags: TTag[]
  loading: boolean
  pendingDeleteTagId: string | null
}>()

defineEmits<{
  edit: [tag: TTag]
  delete: [tag: TTag]
}>()
</script>
