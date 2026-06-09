class CommentsService {
  getPostComments (postId: string, params: TPostCommentsQuery = { pageSize: 20 }) {
    return apiClient.get('/api/posts/{postId}/comments/', {
      dynamicKeys: { postId },
      params
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

  softDeleteComment (postId: string, commentId: string) {
    return apiClient.delete('/api/posts/{postId}/comments/{commentId}/', {
      dynamicKeys: { postId, commentId }
    })
  }

  hardDeleteComment (postId: string, commentId: string) {
    return apiClient.delete('/api/posts/{postId}/comments/{commentId}/permanent/', {
      dynamicKeys: { postId, commentId }
    })
  }
}

export const commentsService = new CommentsService()
