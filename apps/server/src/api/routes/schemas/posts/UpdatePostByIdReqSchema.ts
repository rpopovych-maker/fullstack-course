import { PostSchema } from 'src/types/post/Post';

export const UpdatePostByIdReqSchema = PostSchema.pick({ title: true, description: true });
