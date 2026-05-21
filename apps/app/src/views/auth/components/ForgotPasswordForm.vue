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

    <el-button
      class="w-full"
      native-type="submit"
      type="primary"
      :loading="isSubmitting"
    >
      Send Reset Instructions
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  submitted: [email: string]
}>()

const formRef = useElFormRef(null)
const form = useElFormModel({
  email: ''
})

const rules = useElFormRules({
  email: [useRequiredRule(), useEmailRule()]
})

const isSubmitting = ref(false)
const serverError = ref('')

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
    await authService.resetPassword(form.email)
    emit('submitted', form.email)
  } catch {
    ElMessage.error('Something went wrong, please try again')
  } finally {
    isSubmitting.value = false
  }
}
</script>
