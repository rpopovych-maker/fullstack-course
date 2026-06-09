type TArchiveEntity = 'user' | 'post' | 'comment'
interface IArchiveListQuery { page?: number; pageSize?: number }

type TSoftDeletedUserList = TResponse<'/api/admin/archive/soft-deleted-users/', 'get'>
type TSoftDeletedPostList = TResponse<'/api/admin/archive/soft-deleted-posts/', 'get'>
type TSoftDeletedCommentList = TResponse<'/api/admin/archive/soft-deleted-comments/', 'get'>

type THardDeletedArchiveList = TResponse<'/api/admin/archive/hard-deleted-users/', 'get'>
type THardDeletedArchive = THardDeletedArchiveList['data'][number]

interface IArchivedUserData {
  email?: string
  username?: string
  posts?: unknown[]
  commentsOnOtherUsersPosts?: unknown[]
}

interface IArchivedPostData {
  post?: {
    title?: string
    userId?: string
  }
  comments?: unknown[]
}

interface IArchivedCommentData {
  text?: string
  postId?: string
  userId?: string
}

interface IArchiveDisplayRow {
  key: string
  entityType: TArchiveEntity
  title: string
  subtitle: string
  date: string | null
  archiveId?: string
  entityId?: string
  postId?: string
}
