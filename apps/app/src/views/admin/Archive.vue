<template>
  <div class="flex flex-col gap-6">
    <header class="space-y-1">
      <h1>Archive</h1>
      <p class="t-muted">Review and restore deleted users, posts, and comments.</p>
    </header>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="Soft delete" name="soft">
        <div class="flex flex-col gap-4">
          <el-segmented v-model="softEntity" :options="entityOptions" />

          <el-table
            v-loading="isSoftLoading"
            :data="softRows"
            stripe
            class="rounded-md"
            :empty-text="`No soft-deleted ${entityLabels[softEntity]}`"
          >
            <el-table-column label="Entity" min-width="260">
              <template #default="{ row }: { row: IArchiveDisplayRow }">
                <div class="space-y-1">
                  <div class="t-body wrap-break-word">{{ row.title }}</div>
                  <div class="t-caption wrap-break-word">{{ row.subtitle }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Deleted" width="170">
              <template #default="{ row }: { row: IArchiveDisplayRow }">
                <span class="t-caption">{{ formatNullableDate(row.date) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Actions" width="140" align="right">
              <template #default="{ row }: { row: IArchiveDisplayRow }">
                <el-button
                  size="small"
                  type="primary"
                  :loading="pendingRestoreKey === row.key"
                  @click="restoreSoftDeletedEntity(row)"
                >
                  Restore
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="softPage.totalPages > 1" class="flex justify-center">
            <el-pagination
              background
              :current-page="softPagination[softEntity]"
              layout="prev, pager, next, total"
              :page-size="pageSize"
              :total="softPage.total"
              @current-change="setSoftPage"
            />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Hard delete" name="hard">
        <div class="flex flex-col gap-4">
          <el-segmented v-model="hardEntity" :options="entityOptions" />

          <el-table
            v-loading="isHardLoading"
            :data="hardRows"
            stripe
            class="rounded-md"
            :empty-text="`No hard-deleted ${entityLabels[hardEntity]}`"
          >
            <el-table-column label="Entity" min-width="260">
              <template #default="{ row }: { row: IArchiveDisplayRow }">
                <div class="space-y-1">
                  <div class="t-body wrap-break-word">{{ row.title }}</div>
                  <div class="t-caption wrap-break-word">{{ row.subtitle }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Archived" width="170">
              <template #default="{ row }: { row: IArchiveDisplayRow }">
                <span class="t-caption">{{ formatNullableDate(row.date) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Actions" width="140" align="right">
              <template #default="{ row }: { row: IArchiveDisplayRow }">
                <el-button
                  size="small"
                  type="primary"
                  :loading="pendingRestoreKey === row.key"
                  @click="restoreHardDeletedEntity(row)"
                >
                  Restore
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="hardPage.totalPages > 1" class="flex justify-center">
            <el-pagination
              background
              :current-page="hardPagination[hardEntity]"
              layout="prev, pager, next, total"
              :page-size="pageSize"
              :total="hardPage.total"
              @current-change="setHardPage"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'

type TArchiveTab = 'soft' | 'hard'

const pageSize = 10
const entityOptions = [
  { label: 'Users', value: 'user' },
  { label: 'Posts', value: 'post' },
  { label: 'Comments', value: 'comment' }
] satisfies { label: string; value: TArchiveEntity }[]
const entityLabels: Record<TArchiveEntity, string> = {
  user: 'users',
  post: 'posts',
  comment: 'comments'
}

const activeTab = ref<TArchiveTab>('soft')
const softEntity = ref<TArchiveEntity>('user')
const hardEntity = ref<TArchiveEntity>('user')
const pendingRestoreKey = ref<string | null>(null)
const softPagination = reactive<Record<TArchiveEntity, number>>({
  user: 1,
  post: 1,
  comment: 1
})
const hardPagination = reactive<Record<TArchiveEntity, number>>({
  user: 1,
  post: 1,
  comment: 1
})

const softUserParams = computed(() => ({ page: softPagination.user, pageSize }))
const softPostParams = computed(() => ({ page: softPagination.post, pageSize }))
const softCommentParams = computed(() => ({ page: softPagination.comment, pageSize }))
const hardUserParams = computed(() => ({ page: hardPagination.user, pageSize }))
const hardPostParams = computed(() => ({ page: hardPagination.post, pageSize }))
const hardCommentParams = computed(() => ({ page: hardPagination.comment, pageSize }))

const softUsersQuery = useSoftDeletedUsersQuery(softUserParams)
const softPostsQuery = useSoftDeletedPostsQuery(softPostParams)
const softCommentsQuery = useSoftDeletedCommentsQuery(softCommentParams)
const hardUsersQuery = useHardDeletedArchivesQuery('user', hardUserParams)
const hardPostsQuery = useHardDeletedArchivesQuery('post', hardPostParams)
const hardCommentsQuery = useHardDeletedArchivesQuery('comment', hardCommentParams)
const restoreSoftMutation = useRestoreSoftDeletedEntityMutation()
const restoreHardMutation = useRestoreHardDeletedEntityMutation()

const emptyPage = {
  data: [],
  page: 1,
  pageSize,
  total: 0,
  totalPages: 0
}

const softPage = computed(() => {
  if (softEntity.value === 'post') {
    return softPostsQuery.data.value ?? emptyPage
  }
  if (softEntity.value === 'comment') {
    return softCommentsQuery.data.value ?? emptyPage
  }
  return softUsersQuery.data.value ?? emptyPage
})

const hardPage = computed<THardDeletedArchiveList>(() => {
  if (hardEntity.value === 'post') {
    return hardPostsQuery.data.value ?? emptyPage
  }
  if (hardEntity.value === 'comment') {
    return hardCommentsQuery.data.value ?? emptyPage
  }
  return hardUsersQuery.data.value ?? emptyPage
})

const isSoftLoading = computed(() => {
  if (softEntity.value === 'post') {
    return softPostsQuery.isLoading.value
  }
  if (softEntity.value === 'comment') {
    return softCommentsQuery.isLoading.value
  }
  return softUsersQuery.isLoading.value
})

const isHardLoading = computed(() => {
  if (hardEntity.value === 'post') {
    return hardPostsQuery.isLoading.value
  }
  if (hardEntity.value === 'comment') {
    return hardCommentsQuery.isLoading.value
  }
  return hardUsersQuery.isLoading.value
})

const softRows = computed<IArchiveDisplayRow[]>(() => {
  if (softEntity.value === 'post') {
    const page = softPostsQuery.data.value
    return (page?.data ?? []).map(post => ({
      key: post.id,
      entityType: 'post',
      title: post.title,
      subtitle: `Post ID: ${post.id}`,
      date: post.deletedAt,
      entityId: post.id
    }))
  }

  if (softEntity.value === 'comment') {
    const page = softCommentsQuery.data.value
    return (page?.data ?? []).map(comment => ({
      key: comment.id,
      entityType: 'comment',
      title: comment.text,
      subtitle: `Post ID: ${comment.postId}`,
      date: comment.deletedAt,
      entityId: comment.id,
      postId: comment.postId
    }))
  }

  const page = softUsersQuery.data.value
  return (page?.data ?? []).map(user => ({
    key: user.id,
    entityType: 'user',
    title: user.username,
    subtitle: user.email,
    date: user.deletedAt,
    entityId: user.id
  }))
})

const hardRows = computed<IArchiveDisplayRow[]>(() => {
  return hardPage.value.data.map(archive => toHardArchiveRow(archive))
})

function toHardArchiveRow (archive: THardDeletedArchive): IArchiveDisplayRow {
  if (archive.entityType === 'post') {
    const data = archive.data as IArchivedPostData
    return {
      key: archive.id,
      entityType: 'post',
      title: data.post?.title ?? 'Archived post',
      subtitle: `${data.comments?.length ?? 0} comments`,
      date: archive.archivedAt,
      archiveId: archive.id
    }
  }

  if (archive.entityType === 'comment') {
    const data = archive.data as IArchivedCommentData
    return {
      key: archive.id,
      entityType: 'comment',
      title: data.text ?? 'Archived comment',
      subtitle: data.postId ? `Post ID: ${data.postId}` : archive.originalEntityId,
      date: archive.archivedAt,
      archiveId: archive.id
    }
  }

  const data = archive.data as IArchivedUserData
  return {
    key: archive.id,
    entityType: 'user',
    title: data.username ?? 'Archived user',
    subtitle: data.email ?? archive.originalEntityId,
    date: archive.archivedAt,
    archiveId: archive.id
  }
}

function setSoftPage (page: number) {
  softPagination[softEntity.value] = page
}

function setHardPage (page: number) {
  hardPagination[hardEntity.value] = page
}

function formatNullableDate (iso: string | null) {
  if (!iso) {
    return 'Unknown'
  }

  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

async function confirmRestore (row: IArchiveDisplayRow, mode: TArchiveTab) {
  try {
    await ElMessageBox.confirm(
      `Restore "${row.title}"?`,
      mode === 'hard' ? 'Restore archived entity' : 'Restore entity',
      {
        confirmButtonText: 'Restore',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    )
    return true
  } catch {
    return false
  }
}

async function restoreSoftDeletedEntity (row: IArchiveDisplayRow) {
  if (!await confirmRestore(row, 'soft')) {
    return
  }

  pendingRestoreKey.value = row.key
  try {
    await restoreSoftMutation.mutateAsync(row)
    ElMessage.success('Entity restored')
  } catch {
    ElMessage.error('Failed to restore entity')
  } finally {
    pendingRestoreKey.value = null
  }
}

async function restoreHardDeletedEntity (row: IArchiveDisplayRow) {
  if (!await confirmRestore(row, 'hard')) {
    return
  }

  pendingRestoreKey.value = row.key
  try {
    await restoreHardMutation.mutateAsync(row)
    ElMessage.success('Archived entity restored')
  } catch {
    ElMessage.error('Failed to restore archived entity')
  } finally {
    pendingRestoreKey.value = null
  }
}
</script>
