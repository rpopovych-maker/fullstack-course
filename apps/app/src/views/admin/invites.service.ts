class InvitesService {
  async getInvites () {
    return apiClient.get('/api/admin/invites/')
  }

  async sendInvite (body: TCreateInviteBody) {
    return apiClient.post('/api/admin/invites/', body)
  }

  async resendInvite (inviteId: string) {
    return apiClient.post('/api/admin/invites/{inviteId}/resend/', undefined, { dynamicKeys: { inviteId } })
  }
}

export const invitesService = new InvitesService()
