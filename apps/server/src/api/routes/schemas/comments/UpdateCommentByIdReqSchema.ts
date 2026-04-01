import { CommentSchema } from 'src/types/comment/Comment';

export const UpdateCommentByIdReqSchema = CommentSchema.pick({ text: true });
