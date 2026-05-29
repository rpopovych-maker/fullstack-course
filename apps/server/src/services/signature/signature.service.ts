import crypto from 'node:crypto';
import { SignatureService } from 'src/types/services/SignatureService';

export function getSignatureService(): SignatureService {
  return {
    create(values) {
      return crypto
        .createHmac('sha256', process.env.SIGNATURE_SECRET)
        .update(values.join(':'))
        .digest('hex');
    },

    verify(signature, values) {
      const expected = this.create(values);

      try {
        return crypto.timingSafeEqual(
          Buffer.from(expected, 'hex'),
          Buffer.from(signature, 'hex')
        );
      } catch {
        return false;
      }
    }
  };
}