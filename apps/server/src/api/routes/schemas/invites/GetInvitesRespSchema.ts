import { paginationResponseSchema } from 'src/types/PaginationResponse';
import { InviteSchema } from 'src/types/invite/Invite';

export const GetInvitesRespSchema = paginationResponseSchema(InviteSchema);
