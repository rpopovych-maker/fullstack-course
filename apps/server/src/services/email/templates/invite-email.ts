export function getInviteEmailHtml(params: {
  inviteUrl: string
  expiresAt: string
}) {
  return `
    <p>You have been invited to create an account.</p>
    <p>
      <a href="${params.inviteUrl}">Accept invite</a>
    </p>
    <p>This invite link expires at ${params.expiresAt}.</p>
    <p>If you did not expect this email, you can ignore it.</p>
  `;
}
