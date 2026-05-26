class UsersService {
  getUsers (params?: TUserListQuery) {
    return apiClient.get('/api/admin/users/', { params })
  }

  banUser (userId: string) {
    return apiClient.post('/api/admin/users/{userId}/ban-user/', undefined, {
      dynamicKeys: { userId }
    })
  }

  unbanUser (userId: string) {
    return apiClient.post('/api/admin/users/{userId}/unban-user/', undefined, {
      dynamicKeys: { userId }
    })
  }
}

export const usersService = new UsersService()
