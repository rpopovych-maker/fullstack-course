import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

export const tagsQueryKeys = {
  all: ['admin-tags'] as const,
  lists: () => [...tagsQueryKeys.all, 'list'] as const,
  list: (params: TTagListQuery) => [...tagsQueryKeys.lists(), params] as const
}

export const useTagsQuery = (params: MaybeRefOrGetter<TTagListQuery>) => useQuery({
  key: () => tagsQueryKeys.list(toValue(params)),
  query: () => tagsService.getTags(toValue(params)),
  placeholderData: [] satisfies TTagList
})

export const useCreateTagMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (body: TUpsertTagBody) => tagsService.createTag(body),
    onSuccess: (tag) => {
      cache.setQueriesData<TTagList>({ key: tagsQueryKeys.lists() }, (previous) => {
        return [tag, ...(previous ?? []).filter(item => item.id !== tag.id)]
      })
    },
    onSettled: () => cache.invalidateQueries({ key: tagsQueryKeys.lists() })
  })
}

export const useUpdateTagMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (params: { tagId: string; body: TUpsertTagBody }) => {
      return tagsService.updateTag(params.tagId, params.body)
    },
    onSuccess: (tag) => {
      cache.setQueriesData<TTagList>({ key: tagsQueryKeys.lists() }, (previous) => {
        return (previous ?? []).map(item => item.id === tag.id ? tag : item)
      })
    },
    onSettled: () => cache.invalidateQueries({ key: tagsQueryKeys.lists() })
  })
}

export const useDeleteTagMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (tagId: string) => tagsService.deleteTag(tagId),
    onSuccess: (tag) => {
      cache.setQueriesData<TTagList>({ key: tagsQueryKeys.lists() }, (previous) => {
        return (previous ?? []).filter(item => item.id !== tag.id)
      })
    },
    onSettled: () => cache.invalidateQueries({ key: tagsQueryKeys.lists() })
  })
}
