import { IdentityService } from "src/types/services/IdentityService";
import { HttpError } from "src/api/errors/HttpError";
import { IUserRepo } from "src/types/user/IUserRepo";

export async function signUp(params: {
  identityService: IdentityService;
  userRepo: IUserRepo;
  email: string;
  password: string;
}) {
    const { subId, email } = await params.identityService.createUser(params.email, params.password);
    const user = await params.userRepo.createUser({
      subId,
      email
    });

    return user;
}
