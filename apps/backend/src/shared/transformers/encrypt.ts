import { SecretRecord } from '@/infra/security/types';
import { decrypt, encrypt } from '@/lib/crypt';

export const EncryptTransformer = {
  async to(value: any) {
    return await encrypt(JSON.stringify(value));
  },
  async from(value: string) {
    const decrypted = await decrypt(JSON.parse(value) as SecretRecord);
    return JSON.parse(decrypted);
  },
};
