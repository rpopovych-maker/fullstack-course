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

function addCommentToPage (page: TPostComments | undefined, comment: TComment) {
  if (!page) {
    return {
      data: [comment],
      nextCursor: null
    }
  }

  return {
    ...page,
    data: [comment, ...page.data.filter(item => item.id !== comment.id)]
  }
}

function updateCommentInPage (
  page: TPostComments | undefined,
  commentId: string,
  updater: (comment: TComment) => TComment
) {
  if (!page) {
    return {
      data: [],
      nextCursor: null
    }
  }

  return {
    ...page,
    data: page.data.map(comment => comment.id === commentId ? updater(comment) : comment)
  }
}

function replaceCommentInPage (
  page: TPostComments | undefined,
  commentId: string,
  nextComment: TComment
) {
  return updateCommentInPage(page, commentId, () => nextComment)
}

export const useCreateCommentMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: ({ postId, body }: { postId: string; body: TCreateCommentBody }) => {
      return commentsService.createComment(postId, body)
    },
    onMutate: ({ postId, body }) => {
      const commentsKey = commentsQueryKeys.post(postId)
      cache.cancelQueries({ key: postsQueryKeys.lists() })
      cache.cancelQueries({ key: commentsKey, exact: true })

      const prevComments = cache.getQueryData<TPostComments>(commentsKey)
      const prevPostLists = cache.getEntries({ key: postsQueryKeys.lists() }).map(entry => ({
        key: entry.key,
        data: entry.state.value.data as TPostList | undefined
      }))

      const now = new Date().toISOString()
      const optimisticComment: TComment = {
        id: crypto.randomUUID(),
        postId,
        text: body.text,
        createdAt: now,
        updatedAt: now
      }

      cache.setQueryData<TPostComments>(commentsKey, previous => {
        return addCommentToPage(previous, optimisticComment)
      })

      cache.setQueriesData<TPostList>({ key: postsQueryKeys.lists() }, previous => {
        if (!previous) {
          return previous as unknown as TPostList
        }
        return {
          ...previous,
          data: previous.data.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p)
        }
      })

      return { optimisticCommentId: optimisticComment.id, prevComments, prevPostLists, commentsKey }
    },
    onSuccess: (comment, _vars, ctx) => {
      cache.setQueryData<TPostComments>(ctx.commentsKey, previous => {
        return replaceCommentInPage(previous, ctx.optimisticCommentId, comment)
      })
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevComments) {
        cache.setQueryData<TPostComments>(ctx.commentsKey, ctx.prevComments)
      }
      for (const snapshot of ctx?.prevPostLists ?? []) {
        if (snapshot.data) {
          cache.setQueryData<TPostList>(snapshot.key, snapshot.data)
        }
      }
    },
    onSettled: (_d, _e, vars) => {
      cache.invalidateQueries({ key: postsQueryKeys.lists() })
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
      const commentsKey = commentsQueryKeys.post(postId)
      cache.cancelQueries({ key: commentsKey, exact: true })

      const prevComments = cache.getQueryData<TPostComments>(commentsKey)

      cache.setQueryData<TPostComments>(commentsKey, previous => {
        return updateCommentInPage(previous, commentId, comment => ({ ...comment, ...body }))
      })

      return { prevComments, commentsKey }
    },
    onSuccess: (comment, vars, ctx) => {
      cache.setQueryData<TPostComments>(ctx.commentsKey, previous => {
        return replaceCommentInPage(previous, vars.commentId, comment)
      })
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevComments) {
        cache.setQueryData<TPostComments>(ctx.commentsKey, ctx.prevComments)
      }
    },
    onSettled: (_d, _e, vars) => {
      cache.invalidateQueries({ key: commentsQueryKeys.post(vars.postId), exact: true })
    }
  })
}
