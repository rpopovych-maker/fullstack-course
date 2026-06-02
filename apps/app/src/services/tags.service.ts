class TagsService {
  getTags (params?: TTagListQuery) {
    return apiClient.get('/api/tags/', { params })
  }

  createTag (body: TUpsertTagBody) {
    return apiClient.post('/api/admin/tags/', body)
  }

  updateTag (tagId: string, body: TUpsertTagBody) {
    return apiClient.patch('/api/admin/tags/{tagId}/', body, {
      dynamicKeys: { tagId }
    })
  }

  deleteTag (tagId: string) {
    return apiClient.delete('/api/admin/tags/{tagId}/', {
      dynamicKeys: { tagId }
    })
  }
}

export const tagsService = new TagsService()
