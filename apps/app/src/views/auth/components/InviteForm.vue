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

    <el-skeleton v-if="isLoadingInvite" :rows="4" animated />

    <template v-else>
      <el-form-item label="Email" prop="email">
        <el-input
          v-model.trim="form.email"
          autocomplete="email"
          placeholder="you@example.com"
          readonly
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
        :disabled="!hasInviteAccess"
        :loading="isSubmitting"
      >
        Create account
      </el-button>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { isAxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { supabase } from '@/features/platform/supabase/supabase.client'

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

const isLoadingInvite = ref(true)
const hasInviteAccess = ref(false)
const isSubmitting = ref(false)
const serverError = ref('')
const signedInvite = ref<{
  expireAt: string
  signature: string
} | null>(null)

function getApiError (error: unknown) {
  if (isAxiosError(error) && error.response?.data) {
    return error.response.data
  }

  return error
}

function getRedirectTarget () {
  const redirect = route.query.redirect

  return typeof redirect === 'string' && redirect.startsWith('/')
    ? redirect
    : '/posts'
}

function getErrorCode (error: unknown) {
  if (typeof error !== 'object' || error === null) {
    return ''
  }

  return 'code' in error && typeof error.code === 'string'
    ? error.code
    : ''
}

function getErrorMessage (error: unknown) {
  if (typeof error !== 'object' || error === null) {
    return ''
  }

  return 'message' in error && typeof error.message === 'string'
    ? error.message.toLowerCase()
    : ''
}

function isInviteAlreadyAcceptedError (error: unknown) {
  const message = getErrorMessage(getApiError(error))

  return message.includes('already accepted')
}

function isWeakPasswordError (error: unknown) {
  const apiError = getApiError(error)
  const code = getErrorCode(apiError)
  const message = getErrorMessage(apiError)

  return code === 'weak_password' ||
    message.includes('weak password') ||
    message.includes('password is too weak')
}

function isDuplicateUsernameError (error: unknown) {
  const message = getErrorMessage(getApiError(error))

  return message.includes('duplicate') ||
    message.includes('unique') ||
    message.includes('username')
}

async function submit () {
  if (!formRef.value || isSubmitting.value || !hasInviteAccess.value) {
    return
  }

  serverError.value = ''

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) {
    return
  }

  isSubmitting.value = true

  try {
    if (signedInvite.value) {
      await authService.acceptInviteV2({
        email: form.email,
        username: form.username,
        password: form.password,
        expireAt: signedInvite.value.expireAt,
        signature: signedInvite.value.signature
      })
    } else {
      await authService.acceptInvite(form.username, form.password)
    }

    await authService.signIn(form.email, form.password)
    await authStore.loadCurrentUser()
    await router.push(getRedirectTarget())
  } catch (error) {
    if (isInviteAlreadyAcceptedError(error)) {
      serverError.value = 'This invite has already been accepted'
    } else if (isWeakPasswordError(error)) {
      serverError.value = 'Password is too weak'
    } else if (isDuplicateUsernameError(error)) {
      serverError.value = 'This username is already taken'
    } else {
      ElMessage.error('Something went wrong, please try again')
    }
  } finally {
    isSubmitting.value = false
  }
}

function getQueryString (key: string) {
  const value = route.query[key]

  return typeof value === 'string' ? value : ''
}

onMounted(async () => {
  const email = getQueryString('email')
  const expireAt = getQueryString('expireAt')
  const signature = getQueryString('signature')

  if (email && expireAt && signature) {
    form.email = email
    signedInvite.value = { expireAt, signature }
    hasInviteAccess.value = true
    isLoadingInvite.value = false
    return
  }

  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user?.email) {
    serverError.value = 'Open the invite link from your email to continue'
    isLoadingInvite.value = false
    return
  }

  form.email = data.user.email
  hasInviteAccess.value = true
  isLoadingInvite.value = false
})
</script>
