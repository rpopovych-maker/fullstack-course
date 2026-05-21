<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1>Sign In</h1>
      <p class="t-body-sm">
        Use your account to create posts and comments.
      </p>
    </div>

    <SignInForm />

    <p class="t-body-sm text-center">
      Need an account?
      <RouterLink
        :to="{ name: routeNames.signUp }"
        class="underline underline-offset-4"
      >
        Sign up
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import SignInForm from './components/SignInForm.vue'
</script>
