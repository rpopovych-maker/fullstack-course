<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-1">
        <h1>Invites</h1>
        <p class="t-muted">Track pending and accepted invitations.</p>
      </div>

      <el-button type="primary" @click="openInviteDialog">
        Invite user
      </el-button>
    </header>

    <el-table
      v-loading="isLoading"
      :data="sortedInvites"
      stripe
      class="rounded-md"
      empty-text="No invites yet"
    >
      <el-table-column prop="email" label="Email" min-width="240" />

      <el-table-column label="Status" width="120">
        <template #default="{ row }: { row: TInvite }">
          <el-tag
            :type="row.status === 'accepted' ? 'success' : 'warning'"
            disable-transitions
          >
            {{ formatStatus(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="sentAt" label="Sent" width="160" sortable>
        <template #default="{ row }: { row: TInvite }">
          <span class="t-caption">{{ formatDate(row.sentAt) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Resent" width="160">
        <template #default="{ row }: { row: TInvite }">
          <span class="t-caption">{{ formatNullableDate(row.resentAt) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Accepted" width="160">
        <template #default="{ row }: { row: TInvite }">
          <span class="t-caption">{{ formatNullableDate(row.acceptedAt) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="130" align="right">
        <template #default="{ row }: { row: TInvite }">
          <el-button
            v-if="row.status === 'pending'"
            size="small"
            :loading="pendingResendInviteId === row.id"
            @click="resendInvite(row)"
          >
            Resend
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const { data: invites, isLoading } = useInvitesQuery()
const resendInviteMutation = useResendInviteMutation()
const { openModal } = useModals()

const pendingResendInviteId = ref<string | null>(null)

const sortedInvites = computed<TInviteList>(() => {
  return [...(invites.value ?? [])].sort((a, b) => {
    return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  })
})

function formatStatus (status: TInvite['status']) {
  return status === 'accepted' ? 'Accepted' : 'Pending'
}

function formatDate (iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatNullableDate (iso: string | null) {
  return iso ? formatDate(iso) : 'Never'
}

function openInviteDialog () {
  openModal('InviteUserModal')
}

async function resendInvite (invite: TInvite) {
  pendingResendInviteId.value = invite.id

  try {
    await resendInviteMutation.mutateAsync(invite.id)
    ElMessage.success(`Invite resent to ${invite.email}`)
  } catch {
    ElMessage.error('Failed to resend invite')
  } finally {
    pendingResendInviteId.value = null
  }
}
</script>
