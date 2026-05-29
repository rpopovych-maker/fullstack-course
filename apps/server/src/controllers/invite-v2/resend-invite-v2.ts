import { HttpError } from 'src/api/errors/HttpError';
import { IInviteRepo } from 'src/types/invite/IInviteRepo';
import { EmailService } from 'src/types/services/EmailService';
import { SignatureService } from 'src/types/services/SignatureService';
import { getInviteEmailHtml } from 'src/services/email/templates/invite-email';
import { createInviteLink } from 'src/services/invite-link/invite-link.service';

export async function resendInviteV2(params: {
  inviteId: string
  inviteRepo: IInviteRepo
  emailService: EmailService
  signatureService: SignatureService
}) {
  const invite = await params.inviteRepo.getInviteById(params.inviteId);
  
  if (!invite) {
    throw new HttpError(404, 'Invite not found');
  }

  if (invite.status !== 'pending') {
    throw new HttpError(409, 'Invite is already accepted');
  }
  
  const inviteLink = createInviteLink({
    email: invite.email,
    signatureService: params.signatureService
  });

  await params.emailService.send({
    to: invite.email,
    from: process.env.SENDER_EMAIL,
    subject: 'You have been invited',
    html: getInviteEmailHtml({
      inviteUrl: inviteLink.inviteUrl,
      expiresAt: inviteLink.expireAt
    })
  });

  const updatedInvite = await params.inviteRepo.updateInviteById(invite.id, {
    resentAt: new Date()
  });

  if (!updatedInvite) {
    throw new HttpError(404, 'Invite not found');
  }

  return updatedInvite;
}
