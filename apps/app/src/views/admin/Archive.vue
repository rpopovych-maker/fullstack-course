<template>
  <div class="flex flex-col gap-6">
    <header class="space-y-1">
      <h1>Archive</h1>
      <p class="t-muted">Restore users that were temporarily or permanently deleted.</p>
    </header>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="Soft delete" name="soft">
        <div class="flex flex-col gap-4">
          <el-table
            v-loading="isSoftDeletedUsersLoading"
            :data="softDeletedUsersPage.data"
            stripe
            class="rounded-md"
            empty-text="No soft-deleted users"
          >
            <el-table-column prop="username" label="User" min-width="220">
              <template #default="{ row }: { row: TSoftDeletedUser }">
                <div class="flex items-center gap-3">
                  <AuthorAvatar :username="row.username" :size="32" />
                  <span class="t-body wrap-break-word">{{ row.username }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="email" label="Email" min-width="240" />

            <el-table-column label="Deleted" width="160">
              <template #default="{ row }: { row: TSoftDeletedUser }">
                <span class="t-caption">{{ formatNullableDate(row.deletedAt) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Actions" width="140" align="right">
              <template #default="{ row }: { row: TSoftDeletedUser }">
                <el-button
                  size="small"
                  type="primary"
                  :loading="pendingRestoreId === row.id"
                  @click="restoreSoftDeletedUser(row)"
                >
                  Restore
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="softDeletedUsersPage.totalPages > 1" class="flex justify-center">
            <el-pagination
              background
              :current-page="softPagination.page"
              layout="prev, pager, next, total"
              :page-size="softPagination.pageSize"
              :total="softDeletedUsersPage.total"
              @current-change="setSoftPage"
            />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Hard delete" name="hard">
        <div class="flex flex-col gap-4">
          <el-table
            v-loading="isHardDeletedUsersLoading"
            :data="hardDeletedUsersPage.data"
            stripe
            class="rounded-md"
            empty-text="No hard-deleted users"
          >
            <el-table-column label="User" min-width="220">
              <template #default="{ row }: { row: THardDeletedUserArchive }">
                <div class="flex items-center gap-3">
                  <AuthorAvatar :username="getArchivedUser(row).username ?? 'Deleted user'" :size="32" />
                  <div>
                    <div class="t-body wrap-break-word">
                      {{ getArchivedUser(row).username ?? 'Deleted user' }}
                    </div>
                    <div class="t-caption">
                      {{ row.originalEntityId }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Email" min-width="240">
              <template #default="{ row }: { row: THardDeletedUserArchive }">
                {{ getArchivedUser(row).email ?? 'Unknown' }}
              </template>
            </el-table-column>

            <el-table-column label="Archived" width="160">
              <template #default="{ row }: { row: THardDeletedUserArchive }">
                <span class="t-caption">{{ formatDate(row.archivedAt) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Snapshot" width="170">
              <template #default="{ row }: { row: THardDeletedUserArchive }">
                <span class="t-caption">
                  {{ getArchiveSummary(row) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="Actions" width="140" align="right">
              <template #default="{ row }: { row: THardDeletedUserArchive }">
                <el-button
                  size="small"
                  type="primary"
                  :loading="pendingRestoreId === row.id"
                  @click="restoreHardDeletedUser(row)"
                >
                  Restore
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="hardDeletedUsersPage.totalPages > 1" class="flex justify-center">
            <el-pagination
              background
              :current-page="hardPagination.page"
              layout="prev, pager, next, total"
              :page-size="hardPagination.pageSize"
              :total="hardDeletedUsersPage.total"
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

const activeTab = ref<TArchiveTab>('soft')
const pendingRestoreId = ref<string | null>(null)

const softPagination = reactive({
  page: 1,
  pageSize: 10
})

const hardPagination = reactive({
  page: 1,
  pageSize: 10
})

const softQueryParams = computed<TSoftDeletedUserListQuery>(() => ({
  page: softPagination.page,
  pageSize: softPagination.pageSize,
  order: 'desc',
  orderBy: 'deletedAt'
}))

const hardQueryParams = computed<THardDeletedUserArchiveQuery>(() => ({
  page: hardPagination.page,
  pageSize: hardPagination.pageSize
}))

const { data: softDeletedUsers, isLoading: isSoftDeletedUsersLoading } =
  useSoftDeletedUsersQuery(softQueryParams)
const { data: hardDeletedUsers, isLoading: isHardDeletedUsersLoading } =
  useHardDeletedUserArchivesQuery(hardQueryParams)

const restoreSoftDeletedUserMutation = useRestoreSoftDeletedUserMutation()
const restoreHardDeletedUserMutation = useRestoreHardDeletedUserMutation()

const softDeletedUsersPage = computed<TSoftDeletedUserList>(() => {
  return softDeletedUsers.value ?? {
    data: [],
    page: softPagination.page,
    pageSize: softPagination.pageSize,
    total: 0,
    totalPages: 0
  }
})

const hardDeletedUsersPage = computed<THardDeletedUserArchiveList>(() => {
  return hardDeletedUsers.value ?? {
    data: [],
    page: hardPagination.page,
    pageSize: hardPagination.pageSize,
    total: 0,
    totalPages: 0
  }
})

function setSoftPage (page: number) {
  softPagination.page = page
}

function setHardPage (page: number) {
  hardPagination.page = page
}

function formatDate (iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatNullableDate (iso: string | null) {
  return iso ? formatDate(iso) : 'Unknown'
}

function getArchivedUser (archive: THardDeletedUserArchive): IArchivedUserData {
  return archive.data as IArchivedUserData
}

function getArchiveSummary (archive: THardDeletedUserArchive) {
  const data = getArchivedUser(archive)
  const postsCount = data.posts?.length ?? 0
  const commentsCount = data.commentsOnOtherUsersPosts?.length ?? 0

  return `${postsCount} posts, ${commentsCount} other comments`
}

async function restoreSoftDeletedUser (user: TSoftDeletedUser) {
  try {
    await ElMessageBox.confirm(
      `Restore ${user.username}?`,
      'Restore user',
      {
        confirmButtonText: 'Restore',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    )
  } catch {
    return
  }

  pendingRestoreId.value = user.id

  try {
    await restoreSoftDeletedUserMutation.mutateAsync(user.id)
    ElMessage.success(`${user.username} has been restored`)
  } catch {
    ElMessage.error('Failed to restore user')
  } finally {
    pendingRestoreId.value = null
  }
}

async function restoreHardDeletedUser (archive: THardDeletedUserArchive) {
  const user = getArchivedUser(archive)
  const label = user.username ?? 'this user'

  try {
    await ElMessageBox.confirm(
      `Restore ${label} from archive?`,
      'Restore archived user',
      {
        confirmButtonText: 'Restore',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    )
  } catch {
    return
  }

  pendingRestoreId.value = archive.id

  try {
    await restoreHardDeletedUserMutation.mutateAsync(archive.id)
    ElMessage.success(`${label} has been restored`)
  } catch {
    ElMessage.error('Failed to restore archived user')
  } finally {
    pendingRestoreId.value = null
  }
}
</script>
