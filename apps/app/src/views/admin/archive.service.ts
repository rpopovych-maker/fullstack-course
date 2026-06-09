class ArchiveService {
  getSoftDeletedUsers (params?: TSoftDeletedUserListQuery) {
    return apiClient.get('/api/admin/archive/soft-deleted-users/', { params })
  }

  getHardDeletedUserArchives (params?: THardDeletedUserArchiveQuery) {
    return apiClient.get('/api/admin/archive/hard-deleted-users/', { params })
  }

  restoreSoftDeletedUser (userId: string) {
    return apiClient.post('/api/admin/archive/soft-deleted-users/{userId}/restore/', undefined, {
      dynamicKeys: { userId }
    })
  }

  restoreHardDeletedUser (archiveId: string) {
    return apiClient.post('/api/admin/archive/hard-deleted-users/{archiveId}/restore/', undefined, {
      dynamicKeys: { archiveId }
    })
  }
}

export const archiveService = new ArchiveService()
