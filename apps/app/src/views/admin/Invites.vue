<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-1">
        <h1>Invites</h1>
        <p class="t-muted">Track pending and accepted invitations.</p>
      </div>

      <div class="flex flex-col items-stretch gap-3 sm:items-end">
        <InviteApiVersionSelect />
        <el-button type="primary" @click="openInviteDialog">
          Invite user
        </el-button>
      </div>
    </header>

    <div class="max-w-sm">
      <el-input
        v-model.trim="searchTerm"
        clearable
        placeholder="Search by email"
        aria-label="Search invites"
      />
    </div>

    <InvitesTable
      :invites="invitesPage"
      :loading="isLoading"
      :page="pagination.page"
      :sort="sort"
      :pending-resend-invite-id="pendingResendInviteId"
      @resend="resendInvite"
      @page-change="setPage"
      @sort-change="setSort"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const pagination = reactive({
  page: readPageQuery(),
  pageSize: 10
})

const sort = reactive<{
  orderBy: TInviteListOrderBy
  order: NonNullable<TInviteListQuery['order']>
}>({
  orderBy: 'sentAt',
  order: 'desc'
})

const searchTerm = ref('')
const debouncedSearchTerm = refDebounced(searchTerm, 300)

const searchQuery = computed(() => {
  return debouncedSearchTerm.value.length >= 3 ? debouncedSearchTerm.value : undefined
})

const invitesQueryParams = computed<TInviteListQuery>(() => ({
  page: pagination.page,
  pageSize: pagination.pageSize,
  order: sort.order,
  orderBy: sort.orderBy,
  ...(searchQuery.value ? { search: searchQuery.value } : {})
}))

const { data: invites, isLoading } = useInvitesQuery(invitesQueryParams)
const resendInviteMutation = useResendInviteMutation()
const { openModal } = useModals()

const pendingResendInviteId = ref<string | null>(null)
const inviteApiVersion = useStorage<TInviteApiVersion>('admin-invite-api-version', 'v1')

const invitesPage = computed<TInviteList>(() => {
  return invites.value ?? {
    data: [],
    page: pagination.page,
    pageSize: pagination.pageSize,
    total: 0,
    totalPages: 0
  }
})
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

function openInviteDialog () {
  openModal('InviteUserModal')
}

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
  if (!order || !isInviteSortField(prop)) {
    sort.orderBy = 'sentAt'
    sort.order = 'desc'
  } else {
    sort.orderBy = prop
    sort.order = order === 'ascending' ? 'asc' : 'desc'
  }

  setPage(1)
}

function isInviteSortField (prop: string): prop is TInviteListOrderBy {
  return ['email', 'status', 'sentAt', 'resentAt', 'acceptedAt'].includes(prop)
}

function readPageQuery () {
  const rawPage = Array.isArray(route.query.page) ? route.query.page[0] : route.query.page
  const page = Number(rawPage)

  return Number.isInteger(page) && page > 0 ? page : 1
}

async function resendInvite (invite: TInvite) {
  pendingResendInviteId.value = invite.id

  try {
    await resendInviteMutation.mutateAsync({
      inviteId: invite.id,
      version: inviteApiVersion.value
    })
    ElMessage.success(`Invite resent to ${invite.email}`)
  } catch {
    ElMessage.error('Failed to resend invite')
  } finally {
    pendingResendInviteId.value = null
  }
}
</script>
