import { setInfiniteQueryData, useInfiniteQuery, useMutation, useQueryCache } from '@pinia/colada'
import type { UseInfiniteQueryData } from '@pinia/colada'

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
  getNextPageParam: lastPage => {
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

function createEmptyCommentsData (): TPostCommentsInfiniteData {
  return {
    pages: [{ data: [], nextCursor: null }],
    pageParams: [{ pageSize: COMMENTS_PAGE_SIZE }]
  }
}

function addCommentToPages (comments: TPostCommentsInfiniteData | undefined, comment: TComment) {
  const nextComments = comments ?? createEmptyCommentsData()
  const [firstPage, ...otherPages] = nextComments.pages

  if (!firstPage) {
    return {
      ...nextComments,
      pages: [{ data: [comment], nextCursor: null }]
    }
  }

  return {
    ...nextComments,
    pages: [
      {
        ...firstPage,
        data: [comment, ...firstPage.data.filter(item => item.id !== comment.id)]
      },
      ...otherPages
    ]
  }
}

function updateCommentInPages (
  comments: TPostCommentsInfiniteData | undefined,
  commentId: string,
  updater: (comment: TComment) => TComment
) {
  const nextComments = comments ?? createEmptyCommentsData()

  return {
    ...nextComments,
    pages: nextComments.pages.map(page => ({
      ...page,
      data: page.data.map(comment => comment.id === commentId ? updater(comment) : comment)
    }))
  }
}

function replaceCommentInPages (
  comments: TPostCommentsInfiniteData | undefined,
  commentId: string,
  nextComment: TComment
) {
  return updateCommentInPages(comments, commentId, () => nextComment)
}

function setPostCommentsData (
  cache: ReturnType<typeof useQueryCache>,
  key: ReturnType<typeof commentsQueryKeys.post>,
  data: TPostCommentsInfiniteData | ((oldData: TPostCommentsInfiniteData | undefined) => TPostCommentsInfiniteData)
) {
  setInfiniteQueryData<TPostComments, Error, TPostCommentsPageParam>(cache, key, data)
}

function restorePostCommentsData (
  cache: ReturnType<typeof useQueryCache>,
  key: ReturnType<typeof commentsQueryKeys.post>,
  data: TPostCommentsInfiniteData | undefined
) {
  setPostCommentsData(cache, key, data ?? createEmptyCommentsData())
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

      const prevComments = cache.getQueryData<TPostCommentsInfiniteData>(commentsKey)
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

      setPostCommentsData(cache, commentsKey, previous => {
        return addCommentToPages(previous, optimisticComment)
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
      if (!ctx?.commentsKey) {
        return
      }
      setPostCommentsData(cache, ctx.commentsKey, previous => {
        return replaceCommentInPages(previous, ctx.optimisticCommentId, comment)
      })
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.commentsKey) {
        restorePostCommentsData(cache, ctx.commentsKey, ctx.prevComments)
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

      setPostCommentsData(cache, commentsKey, previous => {
        return updateCommentInPages(previous, commentId, comment => ({ ...comment, ...body }))
      })

      return { prevComments, commentsKey }
    },
    onSuccess: (comment, vars, ctx) => {
      if (!ctx?.commentsKey) {
        return
      }
      setPostCommentsData(cache, ctx.commentsKey, previous => {
        return replaceCommentInPages(previous, vars.commentId, comment)
      })
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.commentsKey) {
        restorePostCommentsData(cache, ctx.commentsKey, ctx.prevComments)
      }
    },
    onSettled: (_d, _e, vars) => {
      cache.invalidateQueries({ key: commentsQueryKeys.post(vars.postId), exact: true })
    }
  })
}
