type TInviteList = TResponse<'/api/admin/invites/', 'get'>
type TInvite = TInviteList[number]
type TCreateInviteBody = TRequestBody<'/api/admin/invites/', 'post'>
