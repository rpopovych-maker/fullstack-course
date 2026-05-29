import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

export const invitesQueryKeys = {
  all: ['admin-invites'] as const,
  lists: () => [...invitesQueryKeys.all, 'list'] as const
}

export const useInvitesQuery = () => useQuery({
  key: invitesQueryKeys.lists(),
  query: () => invitesService.getInvites(),
  placeholderData: []
})

export const useSendInviteMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (params: { body: TCreateInviteBody, version: TInviteApiVersion }) => {
      return invitesService.sendInvite(params.body, params.version)
    },
    onSuccess: (invite) => {
      cache.setQueriesData<TInviteList>({ key: invitesQueryKeys.lists() }, (previous) => {
        if (!previous) {
          return [invite]
        }

        return [
          invite,
          ...previous.filter(item => item.id !== invite.id)
        ]
      })
    },
    onSettled: () => cache.invalidateQueries({ key: invitesQueryKeys.lists() })
  })
}

export const useResendInviteMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: (params: { inviteId: string, version: TInviteApiVersion }) => {
      return invitesService.resendInvite(params.inviteId, params.version)
    },
    onSuccess: (invite) => {
      cache.setQueriesData<TInviteList>({ key: invitesQueryKeys.lists() }, (previous) => {
        if (!previous) {
          return [invite]
        }

        return previous.map(item => item.id === invite.id ? invite : item)
      })
    },
    onSettled: () => cache.invalidateQueries({ key: invitesQueryKeys.lists() })
  })
}
