import { CommentSchema } from 'src/types/comment/Comment';

export const CreateCommentReqSchema = CommentSchema.pick({ text: true });
