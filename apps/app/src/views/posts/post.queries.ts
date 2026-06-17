import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

export const postsQueryKeys = {
  all: ['posts'] as const,
  tags: (params: TPublicTagListQuery) => [...postsQueryKeys.all, 'tags', params] as const,
  lists: () => [...postsQueryKeys.all, 'list'] as const,
  list: (params: TPostListQuery) => [...postsQueryKeys.lists(), params] as const,
  details: () => [...postsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...postsQueryKeys.details(), id] as const
}

export const usePublicTagsQuery = (params: MaybeRefOrGetter<TPublicTagListQuery>) => useQuery({
  key: () => postsQueryKeys.tags(toValue(params)),
  query: () => postsService.getTags(toValue(params)),
  placeholderData: () => [] satisfies TPublicTagList
})

export const usePostsQuery = (params: MaybeRefOrGetter<TPostListQuery>) => useQuery({
  key: () => postsQueryKeys.list(toValue(params)),
  query: () => postsService.getPosts(toValue(params)),
  placeholderData: () => ({
    data: [],
    page: toValue(params).page ?? 1,
    pageSize: toValue(params).pageSize ?? 10,
    total: 0,
    totalPages: 0
  }) satisfies TPostList
})

export const usePostQuery = (id: MaybeRefOrGetter<string>) => useQuery({
  key: () => postsQueryKeys.detail(toValue(id)),
  query: () => postsService.getPostById(toValue(id))
})

export const useCreatePostMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (body: TCreatePostBody) => postsService.createPost(body),
    onSettled: () => cache.invalidateQueries({ key: postsQueryKeys.lists() })
  })
}

export const useUpdatePostMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: ({ id, body }: { id: string; body: TUpdatePostBody }) => postsService.updatePost(id, body),
    onMutate: ({ id, body }) => {
      const detailKey = postsQueryKeys.detail(id)
      const optimisticPostPatch = {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.description !== undefined ? { description: body.description } : {})
      }

      cache.cancelQueries({ key: postsQueryKeys.lists() })
      cache.cancelQueries({ key: detailKey, exact: true })

      const prevDetail = cache.getQueryData<TPostDetail>(detailKey)

      cache.setQueriesData<TPostList>({ key: postsQueryKeys.lists() }, (previous) => {
        if (!previous) {
          return previous as unknown as TPostList
        }
        return {
          ...previous,
          data: previous.data.map(p => p.id === id ? { ...p, ...optimisticPostPatch } : p)
        }
      })

      if (prevDetail) {
        cache.setQueryData<TPostDetail>(detailKey, { ...prevDetail, ...optimisticPostPatch })
      }

      return { prevDetail, detailKey }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx.prevDetail && ctx.detailKey) {
        cache.setQueryData<TPostDetail>(ctx.detailKey, ctx.prevDetail)
      }
      cache.invalidateQueries({ key: postsQueryKeys.lists() })
    },
    onSettled: (_d, _e, vars) => {
      cache.invalidateQueries({ key: postsQueryKeys.lists() })
      cache.invalidateQueries({ key: postsQueryKeys.detail(vars.id), exact: true })
    }
  })
}

const useDeletePostMutation = (
  mutation: (postId: string) => Promise<TResponse<'/api/posts/{postId}/', 'delete'>>
) => {
  const cache = useQueryCache()

  return useMutation({
    mutation,
    onSuccess: (deletedPost) => {
      cache.setQueriesData<TPostList>({ key: postsQueryKeys.lists() }, (previous) => {
        if (!previous) {
          return previous as unknown as TPostList
        }

        return {
          ...previous,
          data: previous.data.filter(post => post.id !== deletedPost.id),
          total: Math.max(0, previous.total - 1)
        }
      })
    },
    onSettled: (_data, _error, postId) => {
      cache.invalidateQueries({ key: postsQueryKeys.lists() })
      cache.invalidateQueries({ key: postsQueryKeys.detail(postId), exact: true }, false)
    }
  })
}

export const useSoftDeletePostMutation = () => {
  return useDeletePostMutation(postId => postsService.softDeletePost(postId))
}

export const useHardDeletePostMutation = () => {
  return useDeletePostMutation(postId => postsService.hardDeletePost(postId))
}
