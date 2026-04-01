import { CommentSchema } from 'src/types/comment/Comment';
import { z } from 'zod';

export const GetPostCommentsRespSchema = z.array(CommentSchema);
