import { paginationResponseSchema } from 'src/types/PaginationResponse';
import { CommentSchema } from 'src/types/comment/Comment';

export const GetSoftDeletedCommentsRespSchema = paginationResponseSchema(CommentSchema);
