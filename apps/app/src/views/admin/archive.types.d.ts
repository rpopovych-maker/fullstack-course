type TSoftDeletedUserList = TResponse<'/api/admin/archive/soft-deleted-users/', 'get'>
type TSoftDeletedUser = TSoftDeletedUserList['data'][number]
type TSoftDeletedUserListQuery = NonNullable<TRequestQuery<'/api/admin/archive/soft-deleted-users/', 'get'>>

type THardDeletedUserArchiveList = TResponse<'/api/admin/archive/hard-deleted-users/', 'get'>
type THardDeletedUserArchive = THardDeletedUserArchiveList['data'][number]
type THardDeletedUserArchiveQuery = NonNullable<TRequestQuery<'/api/admin/archive/hard-deleted-users/', 'get'>>

interface IArchivedUserData {
  id?: string
  email?: string
  username?: string
  role?: string
  deletedAt?: string | null
  createdAt?: string
  posts?: unknown[]
  commentsOnOtherUsersPosts?: unknown[]
}
