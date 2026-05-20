type TPostList = TResponse<'/api/posts/', 'get'>
type TPostListItem = TPostList['data'][number]
type TPostListQuery = NonNullable<TRequestQuery<'/api/posts/', 'get'>>

type TPostDetail = TResponse<'/api/posts/{postId}/', 'get'>
type TPostComments = TResponse<'/api/posts/{postId}/comments/', 'get'>
type TComment = TPostComments['data'][number]

type TCreatePostBody = TRequestBody<'/api/posts/', 'post'>
type TUpdatePostBody = TRequestBody<'/api/posts/{postId}/', 'patch'>

type TCreateCommentBody = TRequestBody<'/api/posts/{postId}/comments/', 'post'>
type TUpdateCommentBody = TRequestBody<'/api/posts/{postId}/comments/{commentId}/', 'patch'>
