class PostsService {
  getPosts () {
    return apiClient.get('/api/posts/')
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
}

export const postsService = new PostsService()
