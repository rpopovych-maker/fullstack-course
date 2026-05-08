type TPostList = TResponse<'/api/posts/', 'get'>
type TPostListItem = TPostList[number]

type TPostDetail = TResponse<'/api/posts/{postId}/', 'get'>
type TComment = TPostDetail['comments'][number]

type TCreatePostBody = TRequestBody<'/api/posts/', 'post'>
type TUpdatePostBody = TRequestBody<'/api/posts/{postId}/', 'patch'>

type TCreateCommentBody = TRequestBody<'/api/posts/{postId}/comments/', 'post'>
type TUpdateCommentBody = TRequestBody<'/api/posts/{postId}/comments/{commentId}/', 'patch'>
