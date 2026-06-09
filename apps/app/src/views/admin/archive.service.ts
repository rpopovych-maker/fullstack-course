class ArchiveService {
  getSoftDeletedUsers (params?: IArchiveListQuery) {
    return apiClient.get('/api/admin/archive/soft-deleted-users/', { params })
  }

  getSoftDeletedPosts (params?: IArchiveListQuery) {
    return apiClient.get('/api/admin/archive/soft-deleted-posts/', { params })
  }

  getSoftDeletedComments (params?: IArchiveListQuery) {
    return apiClient.get('/api/admin/archive/soft-deleted-comments/', { params })
  }

  getHardDeletedArchives (entityType: TArchiveEntity, params?: IArchiveListQuery) {
    const paths = {
      user: '/api/admin/archive/hard-deleted-users/',
      post: '/api/admin/archive/hard-deleted-posts/',
      comment: '/api/admin/archive/hard-deleted-comments/'
    } as const

    return apiClient.get(paths[entityType], { params })
  }

  restoreSoftDeletedUser (userId: string) {
    return apiClient.post('/api/admin/archive/soft-deleted-users/{userId}/restore/', undefined, {
      dynamicKeys: { userId }
    })
  }

  restoreSoftDeletedPost (postId: string) {
    return apiClient.post('/api/posts/{postId}/restore/', undefined, {
      dynamicKeys: { postId }
    })
  }

  restoreSoftDeletedComment (postId: string, commentId: string) {
    return apiClient.post('/api/posts/{postId}/comments/{commentId}/restore/', undefined, {
      dynamicKeys: { postId, commentId }
    })
  }

  restoreHardDeletedArchive (entityType: TArchiveEntity, archiveId: string) {
    const paths = {
      user: '/api/admin/archive/hard-deleted-users/{archiveId}/restore/',
      post: '/api/admin/archive/hard-deleted-posts/{archiveId}/restore/',
      comment: '/api/admin/archive/hard-deleted-comments/{archiveId}/restore/'
    } as const

    return apiClient.post(paths[entityType], undefined, {
      dynamicKeys: { archiveId }
    })
  }
}

export const archiveService = new ArchiveService()
