import { HttpError } from 'src/api/errors/HttpError';
import { IInviteRepo } from 'src/types/invite/IInviteRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IdentityService } from 'src/types/services/IdentityService';
import { SignatureService } from 'src/types/services/SignatureService';
import { IUserRepo } from 'src/types/user/IUserRepo';

export async function acceptInviteV2(params: {
  inviteRepo: IInviteRepo
  userRepo: IUserRepo
  identityService: IdentityService
  transactionManager: ITransactionManager
  signatureService: SignatureService
  email: string
  username: string
  password: string
  expireAt: string
  signature: string
}) {
  const expireAt = new Date(params.expireAt);

  if (Number.isNaN(expireAt.getTime()) || expireAt.getTime() < Date.now()) {
    throw new HttpError(400, 'Invite is expired');
  }

  if (!params.signatureService.verify(params.signature, ['invite', params.email, params.expireAt])) {
    throw new HttpError(400, 'Signature is not valid');
  }

  const invite = await params.inviteRepo.getInviteByEmail(params.email);

  if (!invite) {
    throw new HttpError(404, 'Invite not found');
  }

  if (invite.status !== 'pending') {
    throw new HttpError(409, 'Invite is already accepted');
  }

  const { email, subId } = await params.identityService
    .setPassword(invite.subId, params.password);
  
  return await params.transactionManager.execute(async ({ tx }) => {
    const user = await params.userRepo.createUser({
      email,
      subId,
      role: 'user',
      username: params.username
    }, tx);

    const updatedInvite = await params.inviteRepo.updateInviteById(invite.id, {
      status: 'accepted',
      acceptedAt: new Date()
    }, tx); 

    if (!updatedInvite) {
      throw new HttpError(404, 'Invite not found');
    }

    return user;
  });
}