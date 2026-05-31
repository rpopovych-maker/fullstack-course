class InvitesService {
  async getInvites (params?: TInviteListQuery) {
    return apiClient.get('/api/admin/invites/', { params })
  }

  async sendInvite (body: TCreateInviteBody, version: TInviteApiVersion) {
    if (version === 'v2') {
      return apiClient.post('/api/admin/invites/v2/', body)
    }

    return apiClient.post('/api/admin/invites/', body)
  }

  async resendInvite (inviteId: string, version: TInviteApiVersion) {
    if (version === 'v2') {
      return apiClient.post('/api/admin/invites/{inviteId}/resend/v2/', undefined, { dynamicKeys: { inviteId } })
    }

    return apiClient.post('/api/admin/invites/{inviteId}/resend/', undefined, { dynamicKeys: { inviteId } })
  }
}

export const invitesService = new InvitesService()
