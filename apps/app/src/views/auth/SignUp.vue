<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1>Sign Up</h1>
      <p class="t-body-sm">
        Create an account to start posting.
      </p>
    </div>

    <SignUpForm />

    <p class="t-body-sm text-center">
      Already have an account?
      <RouterLink
        :to="{ name: routeNames.signIn }"
        class="underline underline-offset-4"
      >
        Sign in
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import SignUpForm from './components/SignUpForm.vue'
</script>
