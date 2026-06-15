import { IRepos } from 'src/repos';
import { IUUIDService } from 'src/services/uuid';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ITransactionManager } from './ITransaction';
import { IdentityService } from 'src/types/services/IdentityService';
import { User } from './user/User';
import { IdentityUser } from './identity/IdentityUser';
import { EmailService } from './services/EmailService';
import { SignatureService } from './services/SignatureService';
import { StripeService } from './services/StripeService';
import { Subscription } from './subscription/Subscription';

// set context type
declare module 'fastify' {
  interface FastifyInstance {
    uuid: IUUIDService;
    db: NodePgDatabase;
    repos: IRepos;
    transactionManager: ITransactionManager;
    identityService: IdentityService;
    emailService: EmailService
    signatureService: SignatureService
    stripeService: StripeService
  }

  interface FastifyRequest {
    user?: User;
    userCurrentSubscription?: Subscription | null;
    identityUser?: IdentityUser
  }

  interface FastifyContextConfig {
    skipAuth?: boolean;
    skipUserLookup?: boolean;
  }
}