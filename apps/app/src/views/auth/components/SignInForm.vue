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

    <el-form-item label="Password" prop="password">
      <el-input
        v-model="form.password"
        autocomplete="current-password"
        placeholder="Your password"
        show-password
        type="password"
      />

      <p class="t-body-sm w-full text-right mt-1">
        <RouterLink
          :to="{ name: routeNames.forgotPassword }"
          class="underline underline-offset-4"
        >
          Forgot your password?
        </RouterLink>
      </p>
    </el-form-item>

    <el-button
      class="w-full"
      native-type="submit"
      type="primary"
      :loading="isSubmitting"
    >
      Sign In
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../auth.store'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const formRef = useElFormRef(null)
const form = useElFormModel({
  email: '',
  password: ''
})
const rules = useElFormRules({
  email: [useRequiredRule(), useEmailRule()],
  password: [useRequiredRule()]
})

const isSubmitting = ref(false)
const serverError = ref('')

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

const isInvalidCredentialsError = (error: unknown) => {
  if (getErrorCode(error) === 'invalid_credentials') {
    return true
  }

  if (typeof error !== 'object' || error === null) {
    return false
  }

  return 'message' in error &&
    typeof error.message === 'string' &&
    error.message.toLowerCase().includes('invalid login credentials')
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
    await authStore.signIn(form.email, form.password)
    await router.push(getRedirectTarget())
  } catch (error) {
    if (isInvalidCredentialsError(error)) {
      serverError.value = 'Invalid email or password'
    } else {
      ElMessage.error('Something went wrong, please try again')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
