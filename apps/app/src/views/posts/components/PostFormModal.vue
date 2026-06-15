<template>
  <el-dialog
    :model-value="isOpen.PostFormModal"
    :title="isEdit ? 'Edit post' : 'New post'"
    :before-close="close"
    destroy-on-close
    width="560px"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="submit"
    >
      <el-form-item label="Title" prop="title">
        <el-input
          v-model.trim="form.title"
          placeholder="Give your post a title"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input
          v-model.trim="form.description"
          type="textarea"
          :rows="5"
          placeholder="What's on your mind?"
          maxlength="2000"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="Tags" prop="tagIds">
        <el-select
          v-model="form.tagIds"
          multiple
          filterable
          clearable
          default-first-option
          :reserve-keyword="false"
          :loading="areTagsLoading"
          placeholder="Choose tags"
          class="w-full"
        >
          <el-option
            v-for="tag in tagOptions"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Visibility" prop="visibility">
        <el-radio-group v-model="form.visibility">
          <el-radio value="public">Public</el-radio>
          <el-radio value="members">
            <span class="inline-flex items-center gap-1">
              <Icon name="lock" />
              Members only
            </span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button @click="close">Cancel</el-button>
        <el-button type="primary" @click="submit">
          {{ isEdit ? 'Save changes' : 'Create post' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { usePublicTagsQuery } from '../post.queries'

interface IPostFormPayload {
  id: string
  title: string
  description: string
  tags: TPostDetail['tags']
  visibility: 'public' | 'members'
}

const props = defineProps<{
  post?: IPostFormPayload
}>()

const { isOpen, closeModal } = useModals()

const isEdit = computed(() => Boolean(props.post))

const formRef = useElFormRef(null)
const form = useElFormModel({
  title: props.post?.title ?? '',
  description: props.post?.description ?? '',
  tagIds: props.post?.tags.map(tag => tag.id) ?? [],
  visibility: props.post?.visibility ?? 'public'
})
const rules = useElFormRules({
  title: [useRequiredRule(), useMaxLenRule(255)],
  description: [useMaxLenRule(2000)]
})

const createMutation = useCreatePostMutation()
const updateMutation = useUpdatePostMutation()
const { data: tags, isLoading: areTagsLoading } = usePublicTagsQuery({ search: undefined })
const tagOptions = computed(() => tags.value ?? [])

function close () {
  closeModal('PostFormModal')
}

async function submit () {
  if (!formRef.value) {
    return
  }
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) {
    return
  }

  const body = {
    title: form.title,
    description: form.description || undefined,
    tagIds: form.tagIds,
    visibility: form.visibility
  }

  if (isEdit.value && props.post) {
    updateMutation.mutateAsync({ id: props.post.id, body })
      .then(() => ElMessage.success('Post updated'))
      .catch(() => ElMessage.error('Failed to update post'))
  } else {
    createMutation.mutateAsync(body)
      .then(() => ElMessage.success('Post created'))
      .catch(() => ElMessage.error('Failed to create post'))
  }
  close()
}
</script>
