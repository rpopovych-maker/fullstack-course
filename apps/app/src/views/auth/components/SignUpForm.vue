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

    <el-form-item label="Email" prop="email">
      <el-input
        v-model.trim="form.email"
        autocomplete="email"
        placeholder="you@example.com"
        type="email"
      />
    </el-form-item>

    <el-form-item label="Username" prop="username">
      <el-input
        v-model.trim="form.username"
        autocomplete="username"
        placeholder="alice"
      />
    </el-form-item>

    <el-form-item label="Password" prop="password">
      <el-input
        v-model="form.password"
        autocomplete="new-password"
        placeholder="At least 8 characters"
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
      Sign Up
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { isAxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../auth.store'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const formRef = useElFormRef(null)
const form = useElFormModel({
  email: '',
  username: '',
  password: ''
})
const rules = useElFormRules({
  email: [useRequiredRule(), useEmailRule()],
  username: [useRequiredRule(), useMinLenRule(3)],
  password: [useRequiredRule(), useMinLenRule(8)]
})

const isSubmitting = ref(false)
const serverError = ref('')

const getApiError = (error: unknown) => {
  if (isAxiosError(error) && error.response?.data) {
    return error.response.data
  }

  return error
}

const getRedirectTarget = () => {
  const redirect = route.query.redirect

  return typeof redirect === 'string' && redirect.startsWith('/')
    ? redirect
    : '/posts'
}

const getErrorCode = (error: unknown) => {
  if (typeof error !== 'object' || error === null) {
    return ''
  }

  return 'code' in error && typeof error.code === 'string'
    ? error.code
    : ''
}

const getErrorMessage = (error: unknown) => {
  if (typeof error !== 'object' || error === null) {
    return ''
  }

  return 'message' in error && typeof error.message === 'string'
    ? error.message.toLowerCase()
    : ''
}

const isAlreadyRegisteredError = (error: unknown) => {
  const apiError = getApiError(error)
  const code = getErrorCode(apiError)
  const message = getErrorMessage(apiError)

  return code === 'user_already_registered' ||
    message.includes('user already registered') ||
    message.includes('already registered')
}

const isWeakPasswordError = (error: unknown) => {
  const apiError = getApiError(error)
  const code = getErrorCode(apiError)
  const message = getErrorMessage(apiError)

  return code === 'weak_password' ||
    message.includes('weak password') ||
    message.includes('password is too weak')
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
    await authService.signUp(form.email, form.password, form.username)
    await authService.signIn(form.email, form.password)

    await authStore.loadCurrentUser()

    await router.push(getRedirectTarget())
  } catch (error) {
    if (isAlreadyRegisteredError(error)) {
      serverError.value = 'An account with this email already exists'
    } else if (isWeakPasswordError(error)) {
      serverError.value = 'Password is too weak'
    } else {
      ElMessage.error('Something went wrong, please try again')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
