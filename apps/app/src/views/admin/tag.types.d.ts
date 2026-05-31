type TTagList = TResponse<'/api/admin/tags/', 'get'>
type TTag = TTagList[number]
type TTagListQuery = NonNullable<TRequestQuery<'/api/admin/tags/', 'get'>>
type TUpsertTagBody = TRequestBody<'/api/admin/tags/', 'post'>
