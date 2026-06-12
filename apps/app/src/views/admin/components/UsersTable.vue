<template>
  <el-table
    v-loading="loading"
    :data="users.data"
    stripe
    class="rounded-md"
    empty-text="No users match your filters"
    :default-sort="{ prop: sort.orderBy, order: tableSortOrder }"
    @sort-change="$emit('sort-change', $event)"
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
        <el-tag :type="row.role === 'admin' ? 'success' : 'info'" disable-transitions>
          {{ row.role }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="bannedAt" label="Status" width="110" sortable="custom">
      <template #default="{ row }: { row: TUserListItem }">
        <el-tag :type="row.bannedAt ? 'danger' : 'primary'" disable-transitions>
          {{ row.bannedAt ? 'Banned' : 'Active' }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="createdAt" label="Joined" width="160" sortable="custom">
      <template #default="{ row }: { row: TUserListItem }">
        <span class="t-caption">{{ filters.formatDate(row.createdAt) }}</span>
      </template>
    </el-table-column>

    <el-table-column
      v-if="canManageUsers"
      label="Actions"
      width="300"
      align="right"
    >
      <template #default="{ row }: { row: TUserListItem }">
        <div v-if="canActOn(row)" class="flex justify-end gap-2">
          <el-button
            v-if="canBanUsers"
            size="small"
            :type="row.bannedAt ? 'success' : 'warning'"
            :loading="isPending(row.id, 'ban')"
            @click="$emit('toggle-ban', row)"
          >
            {{ row.bannedAt ? 'Unban' : 'Ban' }}
          </el-button>
          <el-button
            v-if="canDeleteUsers"
            size="small"
            type="warning"
            plain
            :loading="isPending(row.id, 'soft-delete')"
            @click="$emit('soft-delete', row)"
          >
            Soft delete
          </el-button>
          <el-button
            v-if="canDeleteUsers"
            size="small"
            type="danger"
            :loading="isPending(row.id, 'hard-delete')"
            @click="$emit('hard-delete', row)"
          >
            Hard delete
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <div v-if="users.totalPages > 1" class="flex justify-center">
    <el-pagination
      background
      :current-page="page"
      layout="prev, pager, next, total"
      :page-size="users.pageSize"
      :total="users.total"
      @current-change="$emit('page-change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
type TPendingAction = 'ban' | 'soft-delete' | 'hard-delete'

const props = defineProps<{
  users: TUserList
  loading: boolean
  page: number
  sort: {
    orderBy: TUserListOrderBy
    order: NonNullable<TUserListQuery['order']>
  }
  currentUserId?: string
  canBanUsers: boolean
  canDeleteUsers: boolean
  pendingUserId: string | null
  pendingAction: TPendingAction | null
}>()

defineEmits<{
  'toggle-ban': [user: TUserListItem]
  'soft-delete': [user: TUserListItem]
  'hard-delete': [user: TUserListItem]
  'page-change': [page: number]
  'sort-change': [sort: { prop: string; order: 'ascending' | 'descending' | null }]
}>()

const canManageUsers = computed(() => props.canBanUsers || props.canDeleteUsers)
const tableSortOrder = computed(() => props.sort.order === 'asc' ? 'ascending' : 'descending')

function canActOn (user: TUserListItem) {
  return user.id !== props.currentUserId && user.role !== 'admin'
}

function isPending (userId: string, action: TPendingAction) {
  return props.pendingUserId === userId && props.pendingAction === action
}
</script>
