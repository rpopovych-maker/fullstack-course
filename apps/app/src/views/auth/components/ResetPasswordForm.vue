<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-position="top"
    @submit.prevent="submit"
  >
    <el-alert
      v-if="serverError"
      :title="serverError"
      class="mb-4"
      type="error"
      show-icon
      :closable="false"
    />

    <el-form-item label="New password" prop="password">
      <el-input
        v-model="form.password"
        autocomplete="new-password"
        placeholder="At least 8 characters"
        show-password
        type="password"
      />
    </el-form-item>

    <el-form-item label="Confirm password" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        autocomplete="new-password"
        placeholder="Repeat your new password"
        show-password
        type="password"
      />
    </el-form-item>

    <el-button
      class="w-full"
      native-type="submit"
      type="primary"
      :loading="isSubmitting"
    >
      Save New Password
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
const router = useRouter()

const formRef = useElFormRef(null)
const form = useElFormModel({
  password: '',
  confirmPassword: ''
})

const rules = useElFormRules({
  password: [useRequiredRule(), useMinLenRule(8)],
  confirmPassword: [
    useRequiredRule(),
    {
      validator: (_rule, value: string, callback) => {
        if (value !== form.password) {
          callback(new Error('Passwords do not match'))
          return
        }

        callback()
      },
      trigger: ['change', 'blur']
    }
  ]
})

const isSubmitting = ref(false)
const serverError = ref('')

const getErrorMessage = (error: unknown) => {
  if (typeof error !== 'object' || error === null) {
    return ''
  }

  return 'message' in error && typeof error.message === 'string'
    ? error.message.toLowerCase()
    : ''
}

const getErrorCode = (error: unknown) => {
  if (typeof error !== 'object' || error === null) {
    return ''
  }

  return 'code' in error && typeof error.code === 'string'
    ? error.code
    : ''
}

const isMissingRecoverySessionError = (error: unknown) => {
  const message = getErrorMessage(error)

  return message.includes('auth session missing') ||
    message.includes('session missing') ||
    message.includes('jwt')
}

const isSamePasswordError = (error: unknown) => {
  const code = getErrorCode(error)
  const message = getErrorMessage(error)

  return code === 'same_password' ||
    message.includes('different from the old password') ||
    message.includes('same password')
}

const submit = async () => {
  if (!formRef.value || isSubmitting.value) {
    return
  }

  serverError.value = ''

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) {
    return
  }

  isSubmitting.value = true

  try {
    await authService.updatePassword(form.password)
    await authStore.signOut()

    ElMessage.success('Password updated. Sign in with your new password.')
    await router.push({ name: routeNames.signIn })
  } catch (error) {
    if (isSamePasswordError(error)) {
      serverError.value = 'Choose a password that is different from your current one.'
    } else if (isMissingRecoverySessionError(error)) {
      serverError.value = 'This reset link is invalid or expired. Request a new password reset email.'
    } else {
      ElMessage.error('Something went wrong, please try again')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
