import { HttpError } from 'src/api/errors/HttpError';
import { IInviteRepo } from 'src/types/invite/IInviteRepo';
import { IdentityService } from 'src/types/services/IdentityService';

export async function resendInvite(params: {
  inviteId: string
  inviteRepo: IInviteRepo
  identityService: IdentityService
}) {
  const invite = await params.inviteRepo.getInviteById(params.inviteId);
  
  if (!invite) {
    throw new HttpError(404, 'Invite not found');
  }

  if (invite.status !== 'pending') {
    throw new HttpError(409, 'Invite is already accepted');
  }
  
  await params.identityService.resendInvite(invite.email);

  const updatedInvite = await params.inviteRepo.updateInviteById(invite.id, {
    resentAt: new Date()
  });

  if (!updatedInvite) {
    throw new HttpError(404, 'Invite not found');
  }

  return updatedInvite;
}
