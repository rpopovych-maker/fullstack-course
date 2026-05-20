import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

export const commentsQueryKeys = {
  all: ['comments'] as const,
  post: (postId: string) => [...commentsQueryKeys.all, 'post', postId] as const
}

export const usePostCommentsQuery = (postId: MaybeRefOrGetter<string>) => useQuery({
  key: () => commentsQueryKeys.post(toValue(postId)),
  query: () => commentsService.getPostComments(toValue(postId), { pageSize: 100 }),
  placeholderData: () => ({
    data: [],
    nextCursor: null
  }) satisfies TPostComments
})

export const useCreateCommentMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: ({ postId, body }: { postId: string; body: TCreateCommentBody }) => {
      return commentsService.createComment(postId, body)
    },
    onMutate: ({ postId, body }) => {
      const detailKey = postsQueryKeys.detail(postId)
      const commentsKey = commentsQueryKeys.post(postId)
      cache.cancelQueries({ key: postsQueryKeys.lists() })
      cache.cancelQueries({ key: detailKey, exact: true })
      cache.cancelQueries({ key: commentsKey, exact: true })

      const prevDetail = cache.getQueryData<TPostDetail>(detailKey)
      const prevComments = cache.getQueryData<TPostComments>(commentsKey)

      const now = new Date().toISOString()
      const optimisticComment: TComment = {
        id: crypto.randomUUID(),
        postId,
        text: body.text,
        createdAt: now,
        updatedAt: now
      }

      if (prevComments) {
        cache.setQueryData<TPostComments>(commentsKey, {
          ...prevComments,
          data: [optimisticComment, ...prevComments.data]
        })
      }

      cache.setQueriesData<TPostList>({ key: postsQueryKeys.lists() }, previous => {
        if (!previous) {
          return previous as unknown as TPostList
        }
        return {
          ...previous,
          data: previous.data.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p)
        }
      })

      return { prevDetail, prevComments, detailKey, commentsKey }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx.prevDetail && ctx.detailKey) {
        cache.setQueryData<TPostDetail>(ctx.detailKey, ctx.prevDetail)
      }
      if (ctx.prevComments && ctx.commentsKey) {
        cache.setQueryData<TPostComments>(ctx.commentsKey, ctx.prevComments)
      }
      cache.invalidateQueries({ key: postsQueryKeys.lists() })
    },
    onSettled: (_d, _e, vars) => {
      cache.invalidateQueries({ key: postsQueryKeys.lists() })
      cache.invalidateQueries({ key: postsQueryKeys.detail(vars.postId), exact: true })
      cache.invalidateQueries({ key: commentsQueryKeys.post(vars.postId), exact: true })
    }
  })
}

export const useUpdateCommentMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (vars: { postId: string; commentId: string; body: TUpdateCommentBody }) => {
      return commentsService.updateComment(vars.postId, vars.commentId, vars.body)
    },
    onMutate: ({ postId, commentId, body }) => {
      const detailKey = postsQueryKeys.detail(postId)
      const commentsKey = commentsQueryKeys.post(postId)
      cache.cancelQueries({ key: detailKey, exact: true })
      cache.cancelQueries({ key: commentsKey, exact: true })

      const prevDetail = cache.getQueryData<TPostDetail>(detailKey)
      const prevComments = cache.getQueryData<TPostComments>(commentsKey)

      if (prevComments) {
        cache.setQueryData<TPostComments>(commentsKey, {
          ...prevComments,
          data: prevComments.data.map(c => c.id === commentId ? { ...c, ...body } : c)
        })
      }

      return { prevDetail, prevComments, detailKey, commentsKey }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx.prevDetail && ctx.detailKey) {
        cache.setQueryData<TPostDetail>(ctx.detailKey, ctx.prevDetail)
      }
      if (ctx.prevComments && ctx.commentsKey) {
        cache.setQueryData<TPostComments>(ctx.commentsKey, ctx.prevComments)
      }
    },
    onSettled: (_d, _e, vars) => {
      cache.invalidateQueries({ key: postsQueryKeys.lists() })
      cache.invalidateQueries({ key: postsQueryKeys.detail(vars.postId), exact: true })
      cache.invalidateQueries({ key: commentsQueryKeys.post(vars.postId), exact: true })
    }
  })
}
