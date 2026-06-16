type TPostList = TResponse<'/api/posts/', 'get'>
type TPostListItem = TPostList['data'][number]
type TPostListQuery = NonNullable<TRequestQuery<'/api/posts/', 'get'>>
type TPostSortQuery = Pick<TPostListQuery, 'orderBy' | 'order'>
type TPublicTagList = TResponse<'/api/tags/', 'get'>
type TPublicTagListQuery = NonNullable<TRequestQuery<'/api/tags/', 'get'>>

type TPostDetail = TResponse<'/api/posts/{postId}/', 'get'>
type TPostVisibility = TPostDetail['visibility']
type TPostFormPayload = TRequestBody<'/api/posts/', 'post'>

type TPostComments = TResponse<'/api/posts/{postId}/comments/', 'get'>
type TPostCommentsQuery = NonNullable<TRequestQuery<'/api/posts/{postId}/comments/', 'get'>>
type TComment = TPostComments['data'][number]

type TCreatePostBody = TRequestBody<'/api/posts/', 'post'>
type TUpdatePostBody = TRequestBody<'/api/posts/{postId}/', 'patch'>

type TCreateCommentBody = TRequestBody<'/api/posts/{postId}/comments/', 'post'>
type TUpdateCommentBody = TRequestBody<'/api/posts/{postId}/comments/{commentId}/', 'patch'>
