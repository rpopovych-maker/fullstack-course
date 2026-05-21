<template>
  <div class="space-y-6">
    <div
      v-if="isSubmitted"
      class="space-y-6"
    >
      <div class="space-y-2">
        <h1>Check Your Email</h1>
        <p class="t-body-sm">
          If <b>{{ submittedEmail }}</b> is registered, we sent a link to reset your password.
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <el-button
          type="primary"
          @click="goToSignIn"
        >
          Back to Sign In
        </el-button>

        <el-button
          class="w-full ml-0!"
          @click="reset"
        >
          Use Another Email
        </el-button>
      </div>
    </div>

    <template v-else>
      <div class="space-y-2">
        <h1>Forgot Password?</h1>
        <p class="t-body-sm">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <ForgotPasswordForm @submitted="handleSubmitted" />
    </template>

    <template v-if="!isSubmitted">
      <p class="t-body-sm text-center">
        Remembered your password?
        <RouterLink
          :to="{ name: routeNames.signIn }"
          class="underline underline-offset-4"
        >
          Sign in
        </RouterLink>
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const isSubmitted = ref(false)
const submittedEmail = ref('')

const handleSubmitted = (email: string) => {
  submittedEmail.value = email
  isSubmitted.value = true
}

const reset = () => {
  isSubmitted.value = false
  submittedEmail.value = ''
}

const goToSignIn = () => {
  void router.push({ name: routeNames.signIn })
}
</script>
