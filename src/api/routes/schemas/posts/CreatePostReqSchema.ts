import { PostSchema } from 'src/types/post/Post';

export const CreatePostReqSchema = PostSchema.pick({ title: true, description: true });
