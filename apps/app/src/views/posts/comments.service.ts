class CommentsService {
  getPostComments (postId: string) {
    return apiClient.get('/api/posts/{postId}/comments/', {
      dynamicKeys: { postId },
      params: { pageSize: 100 }
    })
  }

  createComment (postId: string, body: TRequestBody<'/api/posts/{postId}/comments/', 'post'>) {
    return apiClient.post('/api/posts/{postId}/comments/', body, { dynamicKeys: { postId } })
  }

  updateComment (
    postId: string,
    commentId: string,
    body: TRequestBody<'/api/posts/{postId}/comments/{commentId}/', 'patch'>
  ) {
    return apiClient.patch(
      '/api/posts/{postId}/comments/{commentId}/',
      body,
      { dynamicKeys: { postId, commentId } }
    )
  }
}

export const commentsService = new CommentsService()
