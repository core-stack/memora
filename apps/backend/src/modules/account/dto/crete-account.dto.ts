export class CreateAccountDto {
  // user
  name: string;
  email: string;
  image?: string;
  emailVerified?: boolean;

  // account
  provider: string;
  providerAccountId: string;
}