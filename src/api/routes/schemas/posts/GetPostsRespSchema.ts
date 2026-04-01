import { PostWithCommentsCountSchema } from 'src/types/post/PostWithCommentsCount';
import { z } from 'zod';

export const GetPostsRespSchema = z.array(PostWithCommentsCountSchema);
