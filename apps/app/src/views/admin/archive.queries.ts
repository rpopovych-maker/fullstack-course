import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

export const archiveQueryKeys = {
  all: ['admin-archive'] as const,
  soft: (entityType: TArchiveEntity) => [...archiveQueryKeys.all, 'soft', entityType] as const,
  softList: (entityType: TArchiveEntity, params: IArchiveListQuery) => [
    ...archiveQueryKeys.soft(entityType),
    params
  ] as const,
  hard: (entityType: TArchiveEntity) => [...archiveQueryKeys.all, 'hard', entityType] as const,
  hardList: (entityType: TArchiveEntity, params: IArchiveListQuery) => [
    ...archiveQueryKeys.hard(entityType),
    params
  ] as const
}

export const useSoftDeletedUsersQuery = (params: MaybeRefOrGetter<IArchiveListQuery>) => useQuery({
  key: () => archiveQueryKeys.softList('user', toValue(params)),
  query: () => archiveService.getSoftDeletedUsers(toValue(params))
})

export const useSoftDeletedPostsQuery = (params: MaybeRefOrGetter<IArchiveListQuery>) => useQuery({
  key: () => archiveQueryKeys.softList('post', toValue(params)),
  query: () => archiveService.getSoftDeletedPosts(toValue(params))
})

export const useSoftDeletedCommentsQuery = (params: MaybeRefOrGetter<IArchiveListQuery>) => useQuery({
  key: () => archiveQueryKeys.softList('comment', toValue(params)),
  query: () => archiveService.getSoftDeletedComments(toValue(params))
})

export const useHardDeletedArchivesQuery = (
  entityType: TArchiveEntity,
  params: MaybeRefOrGetter<IArchiveListQuery>
) => useQuery({
  key: () => archiveQueryKeys.hardList(entityType, toValue(params)),
  query: () => archiveService.getHardDeletedArchives(entityType, toValue(params))
})

const invalidateRestoredEntities = (cache: ReturnType<typeof useQueryCache>) => {
  cache.invalidateQueries({ key: usersQueryKeys.lists() })
  cache.invalidateQueries({ key: postsQueryKeys.all })
  cache.invalidateQueries({ key: commentsQueryKeys.all })
}

export const useRestoreSoftDeletedEntityMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: async (row: IArchiveDisplayRow) => {
      if (row.entityType === 'user' && row.entityId) {
        await archiveService.restoreSoftDeletedUser(row.entityId)
        return
      }
      if (row.entityType === 'post' && row.entityId) {
        await archiveService.restoreSoftDeletedPost(row.entityId)
        return
      }
      if (row.entityType === 'comment' && row.entityId && row.postId) {
        await archiveService.restoreSoftDeletedComment(row.postId, row.entityId)
        return
      }
      throw new Error('Invalid soft-delete archive row')
    },
    onSettled: (_data, _error, row) => {
      cache.invalidateQueries({ key: archiveQueryKeys.soft(row.entityType) })
      invalidateRestoredEntities(cache)
    }
  })
}

export const useRestoreHardDeletedEntityMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: async (row: IArchiveDisplayRow) => {
      if (!row.archiveId) {
        throw new Error('Archive ID is required')
      }
      await archiveService.restoreHardDeletedArchive(row.entityType, row.archiveId)
    },
    onSettled: (_data, _error, row) => {
      cache.invalidateQueries({ key: archiveQueryKeys.hard(row.entityType) })
      invalidateRestoredEntities(cache)
    }
  })
}
