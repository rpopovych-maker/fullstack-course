<template>
  <div class="h-[calc(100dvh-7rem)] min-h-0 flex flex-col gap-6 overflow-hidden">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-1">
        <h1>Tags</h1>
        <p class="t-muted">Manage labels used to organize posts.</p>
      </div>

      <el-button type="primary" @click="openCreateDialog">
        New tag
      </el-button>
    </header>

    <div class="max-w-sm">
      <el-input
        v-model.trim="searchTerm"
        clearable
        placeholder="Search tags"
        aria-label="Search tags"
      />
    </div>

    <div class="min-h-0 flex-1 overflow-hidden">
      <el-table
        v-loading="isLoading"
        :data="tags ?? []"
        stripe
        height="100%"
        class="h-full rounded-md"
        empty-text="No tags match your filters"
      >
        <el-table-column prop="name" label="Name" min-width="240">
          <template #default="{ row }: { row: TTag }">
            <span class="t-body wrap-break-word">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Created" width="160">
          <template #default="{ row }: { row: TTag }">
            <span class="t-caption">{{ formatDate(row.createdAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="160" align="right">
          <template #default="{ row }: { row: TTag }">
            <div class="flex justify-end gap-2">
              <el-button
                size="small"
                aria-label="Edit tag"
                @click="openEditDialog(row)"
              >
                <Icon name="edit" />
              </el-button>
              <el-button
                size="small"
                type="danger"
                aria-label="Delete tag"
                :loading="pendingDeleteTagId === row.id"
                @click="deleteTag(row)"
              >
                <Icon name="trash" />
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="isDialogOpen"
      :title="editingTag ? 'Edit tag' : 'New tag'"
      destroy-on-close
      width="420px"
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="submit"
      >
        <el-form-item label="Name" prop="name">
          <el-input
            v-model.trim="form.name"
            maxlength="100"
            show-word-limit
            placeholder="backend"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button :disabled="isSaving" @click="closeDialog">
            Cancel
          </el-button>
          <el-button type="primary" :loading="isSaving" @click="submit">
            {{ editingTag ? 'Save changes' : 'Create tag' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'

const searchTerm = ref('')
const debouncedSearchTerm = refDebounced(searchTerm, 300)
const searchQuery = computed(() => {
  return debouncedSearchTerm.value.trim() || undefined
})
const tagsQueryParams = computed<TTagListQuery>(() => ({
  ...(searchQuery.value ? { search: searchQuery.value } : {})
}))

const { data: tags, isLoading } = useTagsQuery(tagsQueryParams)
const createTagMutation = useCreateTagMutation()
const updateTagMutation = useUpdateTagMutation()
const deleteTagMutation = useDeleteTagMutation()

const isDialogOpen = ref(false)
const editingTag = ref<TTag | null>(null)
const pendingDeleteTagId = ref<string | null>(null)

const formRef = useElFormRef(null)
const form = useElFormModel<TUpsertTagBody>({
  name: ''
})
const rules = useElFormRules({
  name: [useRequiredRule(), useMaxLenRule(100)]
})

const isSaving = computed(() => {
  return createTagMutation.isLoading.value || updateTagMutation.isLoading.value
})

function openCreateDialog () {
  editingTag.value = null
  form.name = ''
  isDialogOpen.value = true
}

function openEditDialog (tag: TTag) {
  editingTag.value = tag
  form.name = tag.name
  isDialogOpen.value = true
}

function closeDialog () {
  if (isSaving.value) {
    return
  }

  isDialogOpen.value = false
}

function resetForm () {
  editingTag.value = null
  form.name = ''
  formRef.value?.clearValidate()
}

async function submit () {
  if (!formRef.value || isSaving.value) {
    return
  }

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) {
    return
  }

  try {
    if (editingTag.value) {
      await updateTagMutation.mutateAsync({
        tagId: editingTag.value.id,
        body: { name: form.name }
      })
      ElMessage.success('Tag updated')
    } else {
      await createTagMutation.mutateAsync({ name: form.name })
      ElMessage.success('Tag created')
    }

    isDialogOpen.value = false
  } catch {
    ElMessage.error(editingTag.value ? 'Failed to update tag' : 'Failed to create tag')
  }
}

async function deleteTag (tag: TTag) {
  try {
    await ElMessageBox.confirm(
      `Delete tag "${tag.name}"?`,
      'Delete tag',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
  } catch {
    return
  }

  pendingDeleteTagId.value = tag.id
  try {
    await deleteTagMutation.mutateAsync(tag.id)
    ElMessage.success('Tag deleted')
  } catch {
    ElMessage.error('Failed to delete tag')
  } finally {
    pendingDeleteTagId.value = null
  }
}

function formatDate (iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
