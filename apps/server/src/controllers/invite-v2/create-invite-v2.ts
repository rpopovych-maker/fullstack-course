import { IInviteRepo } from 'src/types/invite/IInviteRepo';
import { EmailService } from 'src/types/services/EmailService';
import { IdentityService } from 'src/types/services/IdentityService';
import { SignatureService } from 'src/types/services/SignatureService';
import { getInviteEmailHtml } from 'src/services/email/templates/invite-email';
import { createInviteLink } from 'src/services/invite-link/invite-link.service';

export async function createInviteV2(params: {
  userId: string
  email: string
  inviteRepo: IInviteRepo
  identityService: IdentityService
  signatureService: SignatureService
  emailService: EmailService
}) {
  const { email, subId } = await params.identityService.createInvitedUser(params.email);

  const invite = await params.inviteRepo.createInvite({
    email,
    subId,
    status: 'pending',
    invitedByUserId: params.userId,
    sentAt: new Date()
  });

  const inviteLink = createInviteLink({
    email,
    signatureService: params.signatureService
  });

  await params.emailService.send({
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: 'You have been invited',
    html: getInviteEmailHtml({
      inviteUrl: inviteLink.inviteUrl,
      expiresAt: inviteLink.expireAt
    })
  });

  return invite;
}
