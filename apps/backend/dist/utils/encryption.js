"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptBuffer = exports.encryptBuffer = void 0;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("./config");
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const encryptBuffer = (buffer) => {
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const key = crypto_1.default.scryptSync(config_1.config.encryption.key, 'salt', 32);
    const cipher = crypto_1.default.createCipher(ALGORITHM, key);
    cipher.setAAD(Buffer.from('additional-data'));
    const encrypted = Buffer.concat([
        cipher.update(buffer),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]);
};
exports.encryptBuffer = encryptBuffer;
const decryptBuffer = (encryptedBuffer) => {
    const iv = encryptedBuffer.slice(0, IV_LENGTH);
    const tag = encryptedBuffer.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = encryptedBuffer.slice(IV_LENGTH + TAG_LENGTH);
    const key = crypto_1.default.scryptSync(config_1.config.encryption.key, 'salt', 32);
    const decipher = crypto_1.default.createDecipher(ALGORITHM, key);
    decipher.setAAD(Buffer.from('additional-data'));
    decipher.setAuthTag(tag);
    return Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]);
};
exports.decryptBuffer = decryptBuffer;
//# sourceMappingURL=encryption.js.map