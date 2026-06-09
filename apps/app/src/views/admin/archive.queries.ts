import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

export const archiveQueryKeys = {
  all: ['admin-archive'] as const,
  softDeletedUsers: () => [...archiveQueryKeys.all, 'soft-deleted-users'] as const,
  softDeletedUsersList: (params: TSoftDeletedUserListQuery) => [
    ...archiveQueryKeys.softDeletedUsers(),
    params
  ] as const,
  hardDeletedUsers: () => [...archiveQueryKeys.all, 'hard-deleted-users'] as const,
  hardDeletedUsersList: (params: THardDeletedUserArchiveQuery) => [
    ...archiveQueryKeys.hardDeletedUsers(),
    params
  ] as const
}

export const useSoftDeletedUsersQuery = (
  params: MaybeRefOrGetter<TSoftDeletedUserListQuery>
) => useQuery({
  key: () => archiveQueryKeys.softDeletedUsersList(toValue(params)),
  query: () => archiveService.getSoftDeletedUsers(toValue(params)),
  placeholderData: () => ({
    data: [],
    page: toValue(params).page ?? 1,
    pageSize: toValue(params).pageSize ?? 10,
    total: 0,
    totalPages: 0
  }) satisfies TSoftDeletedUserList
})

export const useHardDeletedUserArchivesQuery = (
  params: MaybeRefOrGetter<THardDeletedUserArchiveQuery>
) => useQuery({
  key: () => archiveQueryKeys.hardDeletedUsersList(toValue(params)),
  query: () => archiveService.getHardDeletedUserArchives(toValue(params)),
  placeholderData: () => ({
    data: [],
    page: toValue(params).page ?? 1,
    pageSize: toValue(params).pageSize ?? 10,
    total: 0,
    totalPages: 0
  }) satisfies THardDeletedUserArchiveList
})

export const useRestoreSoftDeletedUserMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (userId: string) => archiveService.restoreSoftDeletedUser(userId),
    onSettled: () => {
      cache.invalidateQueries({ key: archiveQueryKeys.softDeletedUsers() })
      cache.invalidateQueries({ key: usersQueryKeys.lists() })
    }
  })
}

export const useRestoreHardDeletedUserMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (archiveId: string) => archiveService.restoreHardDeletedUser(archiveId),
    onSettled: () => {
      cache.invalidateQueries({ key: archiveQueryKeys.hardDeletedUsers() })
      cache.invalidateQueries({ key: usersQueryKeys.lists() })
    }
  })
}
