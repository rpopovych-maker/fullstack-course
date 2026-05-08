<template>
  <div class="space-y-8">
    <el-skeleton animated>
      <template #template>
        <div class="space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-2 flex-1">
              <el-skeleton-item variant="h1" style="width: 60%; height: 2rem;" />
              <el-skeleton-item variant="text" style="width: 8rem;" />
            </div>
            <el-skeleton-item variant="button" style="width: 4.5rem; height: 2rem;" />
          </div>
          <el-skeleton-item variant="text" style="width: 100%;" />
          <el-skeleton-item variant="text" style="width: 92%;" />
          <el-skeleton-item variant="text" style="width: 70%;" />
        </div>
      </template>
    </el-skeleton>

    <el-divider />

    <el-skeleton animated>
      <template #template>
        <div class="space-y-6">
          <el-skeleton-item variant="text" style="width: 9rem; height: 1.25rem;" />
          <div v-for="n in 2" :key="n" class="rounded-md border border-(--el-border-color-lighter) p-4 space-y-2">
            <el-skeleton-item variant="text" style="width: 6rem;" />
            <el-skeleton-item variant="text" style="width: 100%;" />
            <el-skeleton-item variant="text" style="width: 80%;" />
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>
