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
    mutation: (body: TCreateInviteBody) => invitesService.sendInvite(body),
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
    mutation: (inviteId: string) => invitesService.resendInvite(inviteId),
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
