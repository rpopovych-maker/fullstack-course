import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

export const usersQueryKeys = {
  all: ['admin-users'] as const,
  lists: () => [...usersQueryKeys.all, 'list'] as const,
  list: (params: TUserListQuery) => [...usersQueryKeys.lists(), params] as const
}

export const useUsersQuery = (params: MaybeRefOrGetter<TUserListQuery>) => useQuery({
  key: () => usersQueryKeys.list(toValue(params)),
  query: () => usersService.getUsers(toValue(params)),
  placeholderData: () => ({
    data: [],
    page: toValue(params).page ?? 1,
    pageSize: toValue(params).pageSize ?? 10,
    total: 0,
    totalPages: 0
  }) satisfies TUserList
})

const patchUserInLists = (
  cache: ReturnType<typeof useQueryCache>,
  userId: string,
  patch: Partial<TUserListItem>
) => {
  cache.setQueriesData<TUserList>({ key: usersQueryKeys.lists() }, (previous) => {
    if (!previous) {
      return previous as unknown as TUserList
    }
    return {
      ...previous,
      data: previous.data.map(user => user.id === userId ? { ...user, ...patch } : user)
    }
  })
}

const useToggleBanMutation = (
  mutation: (userId: string) => Promise<unknown>,
  nextBannedAt: () => string | null
) => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (userId: string) => mutation(userId),
    onMutate: (userId) => {
      cache.cancelQueries({ key: usersQueryKeys.lists() })

      const prevLists = cache.getEntries({ key: usersQueryKeys.lists() }).map(entry => ({
        key: entry.key,
        data: entry.state.value.data as TUserList | undefined
      }))

      patchUserInLists(cache, userId, { bannedAt: nextBannedAt() })

      return { prevLists }
    },
    onError: (_err, _userId, ctx) => {
      for (const snapshot of ctx?.prevLists ?? []) {
        if (snapshot.data) {
          cache.setQueryData<TUserList>(snapshot.key, snapshot.data)
        }
      }
    },
    onSettled: () => cache.invalidateQueries({ key: usersQueryKeys.lists() })
  })
}

export const useBanUserMutation = () => {
  return useToggleBanMutation(
    userId => usersService.banUser(userId),
    () => new Date().toISOString()
  )
}

export const useUnbanUserMutation = () => {
  return useToggleBanMutation(
    userId => usersService.unbanUser(userId),
    () => null
  )
}
