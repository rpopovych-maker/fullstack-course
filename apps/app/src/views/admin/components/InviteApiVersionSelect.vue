<template>
  <el-segmented
    v-model="inviteApiVersion"
    :options="inviteApiVersionOptions"
  />
</template>

<script lang="ts" setup>
const inviteApiVersion = useStorage<TInviteApiVersion>('admin-invite-api-version', 'v1')
const inviteApiVersionOptions = [
  { label: 'Supabase', value: 'v1' },
  { label: 'Resend', value: 'v2' }
]
</script>
