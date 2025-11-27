import CryptoJS from 'crypto-js';

class EncryptionService {
  private masterkey: string;

  constructor() {
    this.masterkey = (import.meta.env.VITE_ENCKEY || '').trim();
  }

  encryptJAVA(text: string): string {
    const options = {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    };
    
    const encrypted = CryptoJS.AES.encrypt(text, this.masterkey, options);
    return encrypted.toString();
  }

  decryptJAVA(value: string): string {
    if (!value) return value;
    
    try {
      const masterkey = this.masterkey;
      const options = {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      };
      
      const decrypted = CryptoJS.AES.decrypt(value, masterkey, options)
        .toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return value;
    }
  }

  set(value: string): string {
    const key = 256;
    const iv = CryptoJS.lib.WordArray.random(16);
    
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value.toString()),
      this.masterkey,
      {
        keySize: key / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    
    return encrypted.toString();
  }
}

export const encryptionService = new EncryptionService();