class PostsService {
  getTags (params?: TPublicTagListQuery) {
    return apiClient.get('/api/tags/', { params })
  }

  getPosts (params?: TPostListQuery) {
    return apiClient.get('/api/posts/', {
      params,
      paramsSerializer: {
        indexes: null
      }
    })
  }

  getPostById (postId: string) {
    return apiClient.get('/api/posts/{postId}/', { dynamicKeys: { postId } })
  }

  createPost (body: TRequestBody<'/api/posts/', 'post'>) {
    return apiClient.post('/api/posts/', body)
  }

  updatePost (postId: string, body: TRequestBody<'/api/posts/{postId}/', 'patch'>) {
    return apiClient.patch('/api/posts/{postId}/', body, { dynamicKeys: { postId } })
  }

  deletePost (postId: string) {
    return apiClient.delete('/api/posts/{postId}/', {
      dynamicKeys: { postId }
    })
  }
}

export const postsService = new PostsService()
