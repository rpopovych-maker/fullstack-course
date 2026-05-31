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

    <el-table
      v-loading="isLoading"
      :data="usersPage.data"
      stripe
      class="rounded-md"
      empty-text="No users match your filters"
      :default-sort="{ prop: sort.orderBy, order: tableSortOrder }"
      @sort-change="setSort"
    >
      <el-table-column prop="username" label="User" min-width="220" sortable="custom">
        <template #default="{ row }: { row: TUserListItem }">
          <div class="flex items-center gap-3">
            <AuthorAvatar :username="row.username" :size="32" />
            <span class="t-body wrap-break-word">{{ row.username }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="email" label="Email" min-width="220" sortable="custom" />

      <el-table-column prop="role" label="Role" width="100" sortable="custom">
        <template #default="{ row }: { row: TUserListItem }">
          <el-tag
            :type="row.role === 'admin' ? 'success' : 'info'"
            disable-transitions
          >
            {{ row.role }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="bannedAt" label="Status" width="110" sortable="custom">
        <template #default="{ row }: { row: TUserListItem }">
          <el-tag
            :type="row.bannedAt ? 'danger' : 'primary'"
            disable-transitions
          >
            {{ row.bannedAt ? 'Banned' : 'Active' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createdAt" label="Joined" width="160" sortable="custom">
        <template #default="{ row }: { row: TUserListItem }">
          <span class="t-caption">{{ formatJoined(row.createdAt) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="canBanUsers"
        label="Actions"
        width="130"
        align="right"
      >
        <template #default="{ row }: { row: TUserListItem }">
          <el-button
            v-if="canActOn(row)"
            size="small"
            :type="row.bannedAt ? 'success' : 'danger'"
            :loading="pendingUserId === row.id"
            @click="toggleBan(row)"
          >
            {{ row.bannedAt ? 'Unban' : 'Ban' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="usersPage.totalPages > 1" class="flex justify-center">
      <el-pagination
        background
        :current-page="pagination.page"
        layout="prev, pager, next, total"
        :page-size="pagination.pageSize"
        :total="usersPage.total"
        @current-change="setPage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/views/auth/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

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

const pendingUserId = ref<string | null>(null)

const usersPage = computed<TUserList>(() => {
  return users.value ?? {
    data: [],
    page: pagination.page,
    pageSize: pagination.pageSize,
    total: 0,
    totalPages: 0
  }
})

const canBanUsers = computed(() => authStore.hasPermission('ban:users'))
const tableSortOrder = computed(() => sort.order === 'asc' ? 'ascending' : 'descending')

function canActOn (user: TUserListItem) {
  return user.id !== authStore.user?.id && user.role !== 'admin'
}

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

function setSort ({ prop, order }: { prop: string, order: 'ascending' | 'descending' | null }) {
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

function formatJoined (iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
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
  const mutation = isBanned ? unbanMutation : banMutation
  try {
    await mutation.mutateAsync(user.id)
    ElMessage.success(isBanned ? `${user.username} has been unbanned` : `${user.username} has been banned`)
  } catch {
    ElMessage.error(isBanned ? 'Failed to unban user' : 'Failed to ban user')
  } finally {
    pendingUserId.value = null
  }
}
</script>
