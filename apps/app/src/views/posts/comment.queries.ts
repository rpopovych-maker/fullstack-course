import { setInfiniteQueryData, useInfiniteQuery, useMutation, useQueryCache } from '@pinia/colada'
import type { UseInfiniteQueryData } from '@pinia/colada'
import { useAuthStore } from '@/views/auth/auth.store'

const COMMENTS_PAGE_SIZE = 20

type TPostCommentsPageParam = Pick<TPostCommentsQuery, 'pageSize' | 'cursorId' | 'cursorCreatedAt'>
type TPostCommentsInfiniteData = UseInfiniteQueryData<TPostComments, TPostCommentsPageParam>

export const commentsQueryKeys = {
  all: ['comments'] as const,
  post: (postId: string) => [...commentsQueryKeys.all, 'post', postId] as const
}

export const usePostCommentsQuery = (postId: MaybeRefOrGetter<string>) => useInfiniteQuery({
  key: () => commentsQueryKeys.post(toValue(postId)),
  query: ({ pageParam }) => commentsService.getPostComments(toValue(postId), pageParam),
  initialPageParam: { pageSize: COMMENTS_PAGE_SIZE },
  getNextPageParam: (lastPage) => {
    if (!lastPage.nextCursor) {
      return null
    }

    return {
      pageSize: COMMENTS_PAGE_SIZE,
      cursorId: lastPage.nextCursor.id,
      cursorCreatedAt: lastPage.nextCursor.createdAt
    }
  },
  placeholderData: () => ({
    pages: [{ data: [], nextCursor: null }],
    pageParams: [{ pageSize: COMMENTS_PAGE_SIZE }]
  }) satisfies TPostCommentsInfiniteData
})

export const useCreateCommentMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: ({ postId, body }: { postId: string; body: TCreateCommentBody }) => {
      return commentsService.createComment(postId, body)
    },
    onMutate: ({ postId, body }) => {
      const authStore = useAuthStore()
      const commentsKey = commentsQueryKeys.post(postId)
      cache.cancelQueries({ key: postsQueryKeys.lists() })
      cache.cancelQueries({ key: commentsKey, exact: true })

      const prevComments = cache.getQueryData<TPostCommentsInfiniteData>(commentsKey)
      const prevPostLists = cache.getEntries({ key: postsQueryKeys.lists() }).map(entry => ({
        key: entry.key,
        data: entry.state.value.data as TPostList | undefined
      }))

      const now = new Date().toISOString()
      const optimisticComment: TComment = {
        id: crypto.randomUUID(),
        userId: authStore.user?.id ?? '',
        postId,
        text: body.text,
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
        author: {
          id: authStore.user?.id ?? '',
          username: authStore.user?.username ?? 'You'
        }
      }

      setInfiniteQueryData<TPostComments, Error, TPostCommentsPageParam>(cache, commentsKey, (previous) => {
        const comments = previous ?? {
          pages: [{ data: [], nextCursor: null }],
          pageParams: [{ pageSize: COMMENTS_PAGE_SIZE }]
        }
        const [firstPage, ...otherPages] = comments.pages

        return {
          ...comments,
          pages: [
            {
              ...(firstPage ?? { nextCursor: null }),
              data: [optimisticComment, ...(firstPage?.data ?? []).filter(item => item.id !== optimisticComment.id)]
            },
            ...otherPages
          ]
        }
      })

      cache.setQueriesData<TPostList>({ key: postsQueryKeys.lists() }, (previous) => {
        if (!previous) {
          return previous as unknown as TPostList
        }
        return {
          ...previous,
          data: previous.data.map((post) => {
            return post.id === postId
              ? { ...post, commentsCount: post.commentsCount + 1 }
              : post
          })
        }
      })

      return { optimisticCommentId: optimisticComment.id, prevComments, prevPostLists, commentsKey }
    },
    onSuccess: (comment, _vars, ctx) => {
      if (!ctx?.commentsKey) {
        return
      }
      setInfiniteQueryData<TPostComments, Error, TPostCommentsPageParam>(cache, ctx.commentsKey, (previous) => {
        const comments = previous ?? {
          pages: [{ data: [], nextCursor: null }],
          pageParams: [{ pageSize: COMMENTS_PAGE_SIZE }]
        }

        return {
          ...comments,
          pages: comments.pages.map(page => ({
            ...page,
            data: page.data.map(item => item.id === ctx.optimisticCommentId ? { ...item, ...comment } : item)
          }))
        }
      })
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.commentsKey) {
        setInfiniteQueryData<TPostComments, Error, TPostCommentsPageParam>(
          cache,
          ctx.commentsKey,
          ctx.prevComments ?? {
            pages: [{ data: [], nextCursor: null }],
            pageParams: [{ pageSize: COMMENTS_PAGE_SIZE }]
          }
        )
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

      const prevComments = cache.getQueryData<TPostCommentsInfiniteData>(commentsKey)

      setInfiniteQueryData<TPostComments, Error, TPostCommentsPageParam>(cache, commentsKey, (previous) => {
        const comments = previous ?? {
          pages: [{ data: [], nextCursor: null }],
          pageParams: [{ pageSize: COMMENTS_PAGE_SIZE }]
        }

        return {
          ...comments,
          pages: comments.pages.map(page => ({
            ...page,
            data: page.data.map((comment) => {
              return comment.id === commentId
                ? { ...comment, ...body }
                : comment
            })
          }))
        }
      })

      return { prevComments, commentsKey }
    },
    onSuccess: (comment, vars, ctx) => {
      if (!ctx?.commentsKey) {
        return
      }
      setInfiniteQueryData<TPostComments, Error, TPostCommentsPageParam>(cache, ctx.commentsKey, (previous) => {
        const comments = previous ?? {
          pages: [{ data: [], nextCursor: null }],
          pageParams: [{ pageSize: COMMENTS_PAGE_SIZE }]
        }

        return {
          ...comments,
          pages: comments.pages.map(page => ({
            ...page,
            data: page.data.map(item => item.id === vars.commentId ? { ...item, ...comment } : item)
          }))
        }
      })
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.commentsKey) {
        setInfiniteQueryData<TPostComments, Error, TPostCommentsPageParam>(
          cache,
          ctx.commentsKey,
          ctx.prevComments ?? {
            pages: [{ data: [], nextCursor: null }],
            pageParams: [{ pageSize: COMMENTS_PAGE_SIZE }]
          }
        )
      }
    },
    onSettled: (_d, _e, vars) => {
      cache.invalidateQueries({ key: commentsQueryKeys.post(vars.postId), exact: true })
    }
  })
}

export const useDeleteCommentMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: ({ postId, commentId }: { postId: string; commentId: string }) => {
      return commentsService.deleteComment(postId, commentId)
    },
    onMutate: ({ postId, commentId }) => {
      const commentsKey = commentsQueryKeys.post(postId)
      cache.cancelQueries({ key: commentsKey, exact: true })

      const prevComments = cache.getQueryData<TPostCommentsInfiniteData>(commentsKey)

      setInfiniteQueryData<TPostComments, Error, TPostCommentsPageParam>(
        cache,
        commentsKey,
        (previous) => {
          const comments = previous ?? {
            pages: [{ data: [], nextCursor: null }],
            pageParams: [{ pageSize: COMMENTS_PAGE_SIZE }]
          }

          return {
            ...comments,
            pages: comments.pages.map(page => ({
              ...page,
              data: page.data.filter(comment => comment.id !== commentId)
            }))
          }
        }
      )

      return { commentsKey, prevComments }
    },
    onError: (_error, _variables, context) => {
      if (context?.commentsKey && context.prevComments) {
        setInfiniteQueryData<TPostComments, Error, TPostCommentsPageParam>(
          cache,
          context.commentsKey,
          context.prevComments
        )
      }
    },
    onSettled: (_data, _error, variables) => {
      cache.invalidateQueries({
        key: commentsQueryKeys.post(variables.postId),
        exact: true
      })
      cache.invalidateQueries({ key: postsQueryKeys.lists() })
    }
  })
}
