type TInviteList = TResponse<'/api/admin/invites/', 'get'>
type TInvite = TInviteList['data'][number]
type TInviteListQuery = NonNullable<TRequestQuery<'/api/admin/invites/', 'get'>>
type TInviteListOrderBy = NonNullable<TInviteListQuery['orderBy']>
type TCreateInviteBody = TRequestBody<'/api/admin/invites/', 'post'>
type TInviteApiVersion = 'v1' | 'v2'
