<template>
  <el-dialog
    :model-value="isOpen.InviteUserModal"
    title="Invite user"
    :before-close="close"
    destroy-on-close
    width="420px"
    @closed="reset"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="submit"
    >
      <el-form-item label="Email" prop="email">
        <el-input
          v-model.trim="form.email"
          autocomplete="email"
          placeholder="you@example.com"
          type="email"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button :disabled="sendInviteMutation.isLoading.value" @click="close">
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="sendInviteMutation.isLoading.value"
          @click="submit"
        >
          Send invite
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const { isOpen, closeModal } = useModals()

const formRef = useElFormRef(null)
const form = useElFormModel<TCreateInviteBody>({
  email: ''
})
const rules = useElFormRules({
  email: [useRequiredRule(), useEmailRule()]
})

const sendInviteMutation = useSendInviteMutation()

function close () {
  if (sendInviteMutation.isLoading.value) {
    return
  }

  closeModal('InviteUserModal')
}

function reset () {
  form.email = ''
  formRef.value?.clearValidate()
}

async function submit () {
  if (!formRef.value || sendInviteMutation.isLoading.value) {
    return
  }

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) {
    return
  }

  try {
    await sendInviteMutation.mutateAsync({ email: form.email })
    ElMessage.success(`Invite sent to ${form.email}`)
    closeModal('InviteUserModal')
  } catch {
    ElMessage.error('Failed to send invite')
  }
}
</script>
