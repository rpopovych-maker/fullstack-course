<template>
  <div class="flex flex-col gap-6">
    <header class="space-y-1">
      <h1>Users</h1>
      <p class="t-muted">Browse everyone who has signed up.</p>
    </header>

    <div class="max-w-sm">
      <el-input
        v-model.trim="searchTerm"
        clearable
        placeholder="Search by username or email"
        aria-label="Search users"
      />
    </div>

    <UsersTable
      :users="usersPage"
      :loading="isLoading"
      :page="pagination.page"
      :sort="sort"
      :current-user-id="authStore.user?.id"
      :can-ban-users="canBanUsers"
      :can-delete-users="canDeleteUsers"
      :pending-user-id="pendingUserId"
      :pending-action="pendingAction"
      @toggle-ban="toggleBan"
      @soft-delete="softDeleteUser"
      @hard-delete="hardDeleteUser"
      @page-change="setPage"
      @sort-change="setSort"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { hasPermission } = usePermissions()

const pagination = reactive({
  page: readPageQuery(),
  pageSize: 10
})

const sort = reactive<{
  orderBy: TUserListOrderBy
  order: NonNullable<TUserListQuery['order']>
}>({
  orderBy: 'createdAt',
  order: 'desc'
})

const searchTerm = ref('')
const debouncedSearchTerm = refDebounced(searchTerm, 300)

const searchQuery = computed(() => {
  return debouncedSearchTerm.value.length >= 3 ? debouncedSearchTerm.value : undefined
})

const usersQueryParams = computed<TUserListQuery>(() => ({
  page: pagination.page,
  pageSize: pagination.pageSize,
  order: sort.order,
  orderBy: sort.orderBy,
  ...(searchQuery.value ? { search: searchQuery.value } : {})
}))

const { data: users, isLoading } = useUsersQuery(usersQueryParams)
const banMutation = useBanUserMutation()
const unbanMutation = useUnbanUserMutation()
const softDeleteMutation = useSoftDeleteUserMutation()
const hardDeleteMutation = useHardDeleteUserMutation()

const pendingUserId = ref<string | null>(null)
const pendingAction = ref<'ban' | 'soft-delete' | 'hard-delete' | null>(null)

const usersPage = computed<TUserList>(() => {
  return users.value ?? {
    data: [],
    page: pagination.page,
    pageSize: pagination.pageSize,
    total: 0,
    totalPages: 0
  }
})

const canBanUsers = computed(() => hasPermission('ban:users'))
const canDeleteUsers = computed(() => hasPermission('delete:users'))

watch(searchTerm, () => {
  setPage(1)
})

watch(
  () => route.query.page,
  () => {
    const page = readPageQuery()

    if (page !== pagination.page) {
      pagination.page = page
    }
  }
)

function setPage (page: number) {
  pagination.page = page

  const query = { ...route.query }

  if (page > 1) {
    query.page = String(page)
  } else {
    delete query.page
  }

  void router.replace({ query })
}

function setSort ({ prop, order }: { prop: string; order: 'ascending' | 'descending' | null }) {
  if (!order || !isUserSortField(prop)) {
    sort.orderBy = 'createdAt'
    sort.order = 'desc'
  } else {
    sort.orderBy = prop
    sort.order = order === 'ascending' ? 'asc' : 'desc'
  }

  setPage(1)
}

function isUserSortField (prop: string): prop is TUserListOrderBy {
  return ['username', 'email', 'role', 'bannedAt', 'createdAt'].includes(prop)
}

function readPageQuery () {
  const rawPage = Array.isArray(route.query.page) ? route.query.page[0] : route.query.page
  const page = Number(rawPage)

  return Number.isInteger(page) && page > 0 ? page : 1
}

async function toggleBan (user: TUserListItem) {
  const isBanned = user.bannedAt !== null

  try {
    await ElMessageBox.confirm(
      isBanned
        ? `Restore access for ${user.username}?`
        : `Ban ${user.username}? They will lose access immediately.`,
      isBanned ? 'Unban user' : 'Ban user',
      {
        confirmButtonText: isBanned ? 'Unban' : 'Ban',
        cancelButtonText: 'Cancel',
        type: isBanned ? 'info' : 'warning',
        confirmButtonClass: isBanned ? '' : 'el-button--danger'
      }
    )
  } catch {
    return
  }

  pendingUserId.value = user.id
  pendingAction.value = 'ban'
  const mutation = isBanned ? unbanMutation : banMutation
  try {
    await mutation.mutateAsync(user.id)
    ElMessage.success(isBanned ? `${user.username} has been unbanned` : `${user.username} has been banned`)
  } catch {
    ElMessage.error(isBanned ? 'Failed to unban user' : 'Failed to ban user')
  } finally {
    pendingUserId.value = null
    pendingAction.value = null
  }
}

async function softDeleteUser (user: TUserListItem) {
  try {
    await ElMessageBox.confirm(
      `Soft delete ${user.username}? Their posts and comments will be temporarily removed and can be restored.`,
      'Soft delete user',
      {
        confirmButtonText: 'Soft delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
  } catch {
    return
  }

  pendingUserId.value = user.id
  pendingAction.value = 'soft-delete'

  try {
    await softDeleteMutation.mutateAsync(user.id)
    ElMessage.success(`${user.username} has been soft deleted`)
  } catch {
    ElMessage.error('Failed to soft delete user')
  } finally {
    pendingUserId.value = null
    pendingAction.value = null
  }
}

async function hardDeleteUser (user: TUserListItem) {
  try {
    await ElMessageBox.confirm(
      `Hard delete ${user.username}? Their user record, posts, comments, and post-tag links will be removed. Recovery will only be possible from the hard-delete archive.`,
      'Hard delete user',
      {
        confirmButtonText: 'Hard delete',
        cancelButtonText: 'Cancel',
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }
    )
  } catch {
    return
  }

  pendingUserId.value = user.id
  pendingAction.value = 'hard-delete'

  try {
    await hardDeleteMutation.mutateAsync(user.id)
    ElMessage.success(`${user.username} has been hard deleted and archived`)
  } catch {
    ElMessage.error('Failed to hard delete user')
  } finally {
    pendingUserId.value = null
    pendingAction.value = null
  }
}
</script>
