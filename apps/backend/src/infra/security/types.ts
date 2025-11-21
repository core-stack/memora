export interface SecretRecord {
  ciphertext: string;
  iv_secret: string;
  tag_secret: string;
  encrypted_data_key: string;
  iv_data_key: string;
  tag_data_key: string;
  salt: string;
}
