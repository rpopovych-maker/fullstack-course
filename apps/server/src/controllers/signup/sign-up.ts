import { IdentityService } from "src/types/services/IdentityService";
import { HttpError } from "src/api/errors/HttpError";

export async function signUp(params: {
  identityService: IdentityService;
  email: string;
  password: string;
}) {
  try {
    return await params.identityService.createUser(params.email, params.password);
  } catch (error) {
    throw new HttpError(
      400,
      error instanceof Error ? error.message : 'Unable to create user',
      error
    );
  }
}
