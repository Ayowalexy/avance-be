import crypto from 'crypto'

const ivCiphertextB64 = ''
const key = '952edf8560a44c06a6956f0bba032fc1';

decrypt(key, ivCiphertextB64);

function decrypt(key, ivCiphertextB64) {


  const ivCiphertext = Buffer.from(ivCiphertextB64, 'base64');
  const iv = ivCiphertext.slice(0, 16);
  const ciphertext = ivCiphertext.slice(16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decryptedData = decipher.update(ciphertext);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);
  console.log(decryptedData.toString());
}
