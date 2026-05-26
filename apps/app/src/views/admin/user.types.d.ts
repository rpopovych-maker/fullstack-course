type TUserList = TResponse<'/api/admin/users/', 'get'>
type TUserListItem = TUserList['data'][number]
type TUserListQuery = NonNullable<TRequestQuery<'/api/admin/users/', 'get'>>
