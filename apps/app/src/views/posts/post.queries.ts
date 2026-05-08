import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

export const postsQueryKeys = {
  posts: ['posts'] as const
}

export const usePostsQuery = () => useQuery({
  key: postsQueryKeys.posts,
  query: () => postsService.getPosts(),
  placeholderData: () => [] as TPostList
})

export const usePostQuery = (id: MaybeRefOrGetter<string>) => useQuery({
  key: () => [...postsQueryKeys.posts, toValue(id)],
  query: () => postsService.getPostById(toValue(id))
})

export const useCreatePostMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (body: TCreatePostBody) => postsService.createPost(body),
    onMutate: (body) => {
      cache.cancelQueries({ key: postsQueryKeys.posts })
      const prev = cache.getQueryData<TPostList>(postsQueryKeys.posts)
      const now = new Date().toISOString()
      const optimistic: TPostListItem = {
        id: crypto.randomUUID(),
        title: body.title,
        description: body.description ?? '',
        commentsCount: 0,
        createdAt: now,
        updatedAt: now
      }
      cache.setQueryData<TPostList>(postsQueryKeys.posts, [optimistic, ...(prev ?? [])])
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx.prev) {
        cache.setQueryData<TPostList>(postsQueryKeys.posts, ctx.prev)
      }
    },
    onSettled: () => cache.invalidateQueries({ key: postsQueryKeys.posts })
  })
}

export const useUpdatePostMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: ({ id, body }: { id: string; body: TUpdatePostBody }) => postsService.updatePost(id, body),
    onMutate: ({ id, body }) => {
      const detailKey = [...postsQueryKeys.posts, id]
      cache.cancelQueries({ key: postsQueryKeys.posts })
      cache.cancelQueries({ key: detailKey, exact: true })

      const prevList = cache.getQueryData<TPostList>(postsQueryKeys.posts)
      const prevDetail = cache.getQueryData<TPostDetail>(detailKey)

      if (prevList) {
        cache.setQueryData<TPostList>(
          postsQueryKeys.posts,
          prevList.map(p => p.id === id ? { ...p, ...body } : p)
        )
      }
      if (prevDetail) {
        cache.setQueryData<TPostDetail>(detailKey, { ...prevDetail, ...body })
      }

      return { prevList, prevDetail, detailKey }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx.prevList) {
        cache.setQueryData<TPostList>(postsQueryKeys.posts, ctx.prevList)
      }
      if (ctx.prevDetail && ctx.detailKey) {
        cache.setQueryData<TPostDetail>(ctx.detailKey, ctx.prevDetail)
      }
    },
    onSettled: (_d, _e, vars) => {
      cache.invalidateQueries({ key: postsQueryKeys.posts })
      cache.invalidateQueries({ key: [...postsQueryKeys.posts, vars.id], exact: true })
    }
  })
}
