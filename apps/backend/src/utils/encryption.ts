import crypto from 'crypto';
import { config } from './config';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

export const encryptBuffer = (buffer: Buffer): Buffer => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.scryptSync(config.encryption.key, 'salt', 32);
  
  const cipher = crypto.createCipher(ALGORITHM, key);
  cipher.setAAD(Buffer.from('additional-data'));
  
  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final(),
  ]);
  
  const tag = cipher.getAuthTag();
  
  return Buffer.concat([iv, tag, encrypted]);
};

export const decryptBuffer = (encryptedBuffer: Buffer): Buffer => {
  const iv = encryptedBuffer.slice(0, IV_LENGTH);
  const tag = encryptedBuffer.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = encryptedBuffer.slice(IV_LENGTH + TAG_LENGTH);
  
  const key = crypto.scryptSync(config.encryption.key, 'salt', 32);
  
  const decipher = crypto.createDecipher(ALGORITHM, key);
  decipher.setAAD(Buffer.from('additional-data'));
  decipher.setAuthTag(tag);
  
  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
};