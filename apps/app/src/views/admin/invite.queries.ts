import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

export const invitesQueryKeys = {
  all: ['admin-invites'] as const,
  lists: () => [...invitesQueryKeys.all, 'list'] as const,
  list: (params: TInviteListQuery) => [...invitesQueryKeys.lists(), params] as const
}

export const useInvitesQuery = (params: MaybeRefOrGetter<TInviteListQuery>) => useQuery({
  key: () => invitesQueryKeys.list(toValue(params)),
  query: () => invitesService.getInvites(toValue(params)),
  placeholderData: () => ({
    data: [],
    page: toValue(params).page ?? 1,
    pageSize: toValue(params).pageSize ?? 10,
    total: 0,
    totalPages: 0
  }) satisfies TInviteList
})

export const useSendInviteMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (params: { body: TCreateInviteBody; version: TInviteApiVersion }) => {
      return invitesService.sendInvite(params.body, params.version)
    },
    onSettled: () => cache.invalidateQueries({ key: invitesQueryKeys.lists() })
  })
}

export const useResendInviteMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (params: { inviteId: string; version: TInviteApiVersion }) => {
      return invitesService.resendInvite(params.inviteId, params.version)
    },
    onSuccess: (invite) => {
      cache.setQueriesData<TInviteList>({ key: invitesQueryKeys.lists() }, (previous) => {
        if (!previous) {
          return previous as unknown as TInviteList
        }

        return {
          ...previous,
          data: previous.data.map(item => item.id === invite.id ? invite : item)
        }
      })
    },
    onSettled: () => cache.invalidateQueries({ key: invitesQueryKeys.lists() })
  })
}
