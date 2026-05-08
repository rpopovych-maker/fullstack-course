import { useMutation, useQueryCache } from '@pinia/colada'

export const useCreateCommentMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: ({ postId, body }: { postId: string; body: TCreateCommentBody }) => {
      return commentsService.createComment(postId, body)
    },
    onMutate: ({ postId, body }) => {
      const detailKey = [...postsQueryKeys.posts, postId]
      cache.cancelQueries({ key: postsQueryKeys.posts })
      cache.cancelQueries({ key: detailKey, exact: true })

      const prevList = cache.getQueryData<TPostList>(postsQueryKeys.posts)
      const prevDetail = cache.getQueryData<TPostDetail>(detailKey)

      const now = new Date().toISOString()
      const optimisticComment: TComment = {
        id: crypto.randomUUID(),
        postId,
        text: body.text,
        createdAt: now,
        updatedAt: now
      }

      if (prevDetail) {
        cache.setQueryData<TPostDetail>(detailKey, {
          ...prevDetail,
          comments: [...prevDetail.comments, optimisticComment]
        })
      }
      if (prevList) {
        cache.setQueryData<TPostList>(
          postsQueryKeys.posts,
          prevList.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p)
        )
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
      cache.invalidateQueries({ key: [...postsQueryKeys.posts, vars.postId], exact: true })
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
      const detailKey = [...postsQueryKeys.posts, postId]
      cache.cancelQueries({ key: detailKey, exact: true })

      const prevDetail = cache.getQueryData<TPostDetail>(detailKey)
      if (prevDetail) {
        cache.setQueryData<TPostDetail>(detailKey, {
          ...prevDetail,
          comments: prevDetail.comments.map(c => c.id === commentId ? { ...c, ...body } : c)
        })
      }

      return { prevDetail, detailKey }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx.prevDetail && ctx.detailKey) {
        cache.setQueryData<TPostDetail>(ctx.detailKey, ctx.prevDetail)
      }
    },
    onSettled: (_d, _e, vars) => {
      cache.invalidateQueries({ key: postsQueryKeys.posts })
      cache.invalidateQueries({ key: [...postsQueryKeys.posts, vars.postId], exact: true })
    }
  })
}
