<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1>Set a New Password</h1>
      <p class="t-body-sm">
        Choose a new password for your account. After saving it, you can sign in again.
      </p>
    </div>

    <ResetPasswordForm />

    <p class="t-body-sm text-center">
      Need a new reset link?
      <RouterLink
        :to="{ name: routeNames.forgotPassword }"
        class="underline underline-offset-4"
      >
        Send another email
      </RouterLink>
    </p>
  </div>
</template>
