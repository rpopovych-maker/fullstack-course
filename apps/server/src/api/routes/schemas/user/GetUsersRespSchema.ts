import { paginationResponseSchema } from 'src/types/PaginationResponse';
import { UserSchema } from 'src/types/user/User';

export const GetUsersRespSchema = paginationResponseSchema(UserSchema);
