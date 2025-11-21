export type CallbackResponse = {
  providerAccountId: string;
  email: string;
  name: string;
  image: string;
  provider: string;
};

export interface Provider {
  path: string;
  getAuthUrl(): string | Promise<string>;
  callback(code: string): Promise<CallbackResponse>;
}
