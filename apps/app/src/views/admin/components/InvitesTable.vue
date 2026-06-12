<template>
  <el-table
    v-loading="loading"
    :data="invites.data"
    stripe
    class="rounded-md"
    empty-text="No invites yet"
    :default-sort="{ prop: sort.orderBy, order: tableSortOrder }"
    @sort-change="$emit('sort-change', $event)"
  >
    <el-table-column prop="email" label="Email" min-width="240" sortable="custom" />

    <el-table-column prop="status" label="Status" width="120" sortable="custom">
      <template #default="{ row }: { row: TInvite }">
        <el-tag
          :type="row.status === 'accepted' ? 'success' : 'warning'"
          disable-transitions
        >
          {{ row.status === 'accepted' ? 'Accepted' : 'Pending' }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="sentAt" label="Sent" width="160" sortable="custom">
      <template #default="{ row }: { row: TInvite }">
        <span class="t-caption">{{ filters.formatDate(row.sentAt) }}</span>
      </template>
    </el-table-column>

    <el-table-column prop="resentAt" label="Resent" width="160" sortable="custom">
      <template #default="{ row }: { row: TInvite }">
        <span class="t-caption">{{ filters.formatDate(row.resentAt, 'Never') }}</span>
      </template>
    </el-table-column>

    <el-table-column prop="acceptedAt" label="Accepted" width="160" sortable="custom">
      <template #default="{ row }: { row: TInvite }">
        <span class="t-caption">{{ filters.formatDate(row.acceptedAt, 'Never') }}</span>
      </template>
    </el-table-column>

    <el-table-column label="Actions" width="130" align="right">
      <template #default="{ row }: { row: TInvite }">
        <el-button
          v-if="row.status === 'pending'"
          size="small"
          :loading="pendingResendInviteId === row.id"
          @click="$emit('resend', row)"
        >
          Resend
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div v-if="invites.totalPages > 1" class="flex justify-center">
    <el-pagination
      background
      :current-page="page"
      layout="prev, pager, next, total"
      :page-size="invites.pageSize"
      :total="invites.total"
      @current-change="$emit('page-change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  invites: TInviteList
  loading: boolean
  page: number
  sort: {
    orderBy: TInviteListOrderBy
    order: NonNullable<TInviteListQuery['order']>
  }
  pendingResendInviteId: string | null
}>()

defineEmits<{
  resend: [invite: TInvite]
  'page-change': [page: number]
  'sort-change': [sort: { prop: string; order: 'ascending' | 'descending' | null }]
}>()

const tableSortOrder = computed(() => props.sort.order === 'asc' ? 'ascending' : 'descending')
</script>
