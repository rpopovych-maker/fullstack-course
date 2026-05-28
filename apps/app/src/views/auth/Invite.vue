<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1>Accept invite</h1>
      <p class="t-body-sm">
        Finish setting up your account to join the workspace.
      </p>
    </div>

    <InviteForm />

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
