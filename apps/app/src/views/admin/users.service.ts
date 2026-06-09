class UsersService {
  getUsers (params?: TUserListQuery) {
    return apiClient.get('/api/admin/users/', { params })
  }

  banUser (userId: string) {
    return apiClient.post('/api/admin/users/{userId}/ban/', undefined, {
      dynamicKeys: { userId }
    })
  }

  unbanUser (userId: string) {
    return apiClient.post('/api/admin/users/{userId}/unban/', undefined, {
      dynamicKeys: { userId }
    })
  }

  softDeleteUser (userId: string) {
    return apiClient.delete('/api/admin/users/{userId}/', {
      dynamicKeys: { userId }
    })
  }

  hardDeleteUser (userId: string) {
    return apiClient.delete('/api/admin/users/{userId}/permanent/', {
      dynamicKeys: { userId }
    })
  }
}

export const usersService = new UsersService()
