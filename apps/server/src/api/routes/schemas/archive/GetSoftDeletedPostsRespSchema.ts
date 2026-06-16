import { paginationResponseSchema } from 'src/types/PaginationResponse';
import { PostSchema } from 'src/types/post/Post';

export const GetSoftDeletedPostsRespSchema = paginationResponseSchema(PostSchema);
