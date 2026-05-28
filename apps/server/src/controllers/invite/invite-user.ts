import { IInviteRepo } from 'src/types/invite/IInviteRepo';
import { IdentityService } from 'src/types/services/IdentityService';

export async function inviteUser(params: {
  userId: string
  email: string
  inviteRepo: IInviteRepo
  identityService: IdentityService
}) {
  const { email, subId } = await params.identityService.inviteUser(params.email);

  const invite = await params.inviteRepo.createInvite({
    email,
    subId,
    status: 'pending',
    invitedByUserId: params.userId,
    sentAt: new Date()
  });

  return invite;
}