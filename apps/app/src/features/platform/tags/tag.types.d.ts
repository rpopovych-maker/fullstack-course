type TTagList = TResponse<'/api/tags/', 'get'>
type TTag = TTagList[number]
type TTagListQuery = NonNullable<TRequestQuery<'/api/tags/', 'get'>>
type TUpsertTagBody = TRequestBody<'/api/admin/tags/', 'post'>
