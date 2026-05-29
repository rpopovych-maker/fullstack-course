import { SignatureService } from 'src/types/services/SignatureService';

export function createInviteLink(params: {
  email: string
  signatureService: SignatureService
}) {
  // 1 hour
  const expireAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const signature = params.signatureService.create(['invite', params.email, expireAt]);
  const inviteUrl = new URL('/auth/sign-up/invite-v2', process.env.CLIENT_APP_URL);

  inviteUrl.searchParams.set('email', params.email);
  inviteUrl.searchParams.set('expireAt', expireAt);
  inviteUrl.searchParams.set('signature', signature);

  return {
    expireAt,
    inviteUrl: inviteUrl.toString()
  };
}
