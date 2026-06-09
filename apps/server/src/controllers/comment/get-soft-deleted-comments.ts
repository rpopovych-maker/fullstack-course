import { ICommentRepo } from 'src/types/comment/ICommentRepo';

export async function getSoftDeletedComments(params: {
  commentRepo: ICommentRepo
  page: number
  pageSize: number
}) {
  return params.commentRepo.getSoftDeletedComments({
    page: params.page,
    pageSize: params.pageSize
  });
}
