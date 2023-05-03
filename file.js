import crypto from 'crypto';
import fs from 'fs';
import sshpk from 'sshpk';
const algorithm = 'aes-256-cbc'; //Using AES encryption


const secretKey = '952edf8560a44c06a6956f0bba032fc1'


let data = 'NGKdq8Loexm3K7gesJ8ijKEqJXbQVN01k7t+tkuUGAfYDU2drqycojSbizbKKm8Ya5/U4WJ8QTfVgaOawVs/5KROy06kNHYZaGtSJLu+ZAbA7oeD0eub+YTkrVQLO49qHdeW3YupguYn6eP85n95FuHVJIRDKasMDKCNGAuwvaHp2dijHcruh5o5XGOhrpjPLYsBLQgmY/0n+2uRysPLtBVyvurqmu8WCh15l9IJVPVQQYud/WiZIr6tzQ1vOtnWOM0JYTQF4Pfv5kzC/QqLqVJXCa6LFTsPwEtz5uYKcROuxFc29ct2zimJd2G0jctbHtZUWjK18Dc+yTb6lrg+0FMLbSQXOtHI8rQszquE7fQ+/RNnnHbdkRloy4luVUU7Nda/9bHJ/9qtTmI9diTmGnSh18NLVUuNd1JrsBYbasOsf2bTcpBCTMBHo+ei/HO/0pQLTUulaL4fKDLQfQ1/v8ZDJW1qro2zerxpk6Rwz2f3BNIzLlqL63v95OcuCN2X7+ThkBtudpLJmkW6HPnS9eAmeWgLSVmSTOGQMtPPRNiKwVmpc+2xKH/Z65sXTvPm6+KQ2PLP7deSTMukYzXJKTxokTBpJcQKb5iySBF1Lts='


let buff = Buffer.from(data, 'base64') //new Buffer(data, 'base64');
let text_2 = buff.toString('ascii');



const func = () => {
    let ivCiphertext = buff.toString('ascii')// base64_decode(text);
    let iv = ivCiphertext.toString().substr(0, 16) //substr(ivCiphertext, 0, 16);
    let ciphertext = ivCiphertext.substr(0, 16) //substr(ivCiphertext, 16);
    // // let decryptedData = openssl_decrypt(ciphertext, "aes-256-cbc", $key, OPENSSL_RAW_DATA, iv);
    console.log(iv, ciphertext)

    // const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    // let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
    // return decrypted + decipher.final('utf8');
}

// function decrypt($key, $ivCiphertextB64) {
//     $ivCiphertext = base64_decode($ivCiphertextB64);
//     $iv = substr($ivCiphertext, 0, 16);
//     $ciphertext = substr($ivCiphertext, 16);
//     $decryptedData = openssl_decrypt($ciphertext, "aes-256-cbc", $key, OPENSSL_RAW_DATA, $iv); 
//     echo $decryptedData;
// }

// function decrypt(text) {
//     let data = 'NGKdq8Loexm3K7gesJ8ijKEqJXbQVN01k7t+tkuUGAfYDU2drqycojSbizbKKm8Ya5/U4WJ8QTfVgaOawVs/5KROy06kNHYZaGtSJLu+ZAbA7oeD0eub+YTkrVQLO49qHdeW3YupguYn6eP85n95FuHVJIRDKasMDKCNGAuwvaHp2dijHcruh5o5XGOhrpjPLYsBLQgmY/0n+2uRysPLtBVyvurqmu8WCh15l9IJVPVQQYud/WiZIr6tzQ1vOtnWOM0JYTQF4Pfv5kzC/QqLqVJXCa6LFTsPwEtz5uYKcROuxFc29ct2zimJd2G0jctbHtZUWjK18Dc+yTb6lrg+0FMLbSQXOtHI8rQszquE7fQ+/RNnnHbdkRloy4luVUU7Nda/9bHJ/9qtTmI9diTmGnSh18NLVUuNd1JrsBYbasOsf2bTcpBCTMBHo+ei/HO/0pQLTUulaL4fKDLQfQ1/v8ZDJW1qro2zerxpk6Rwz2f3BNIzLlqL63v95OcuCN2X7+ThkBtudpLJmkW6HPnS9eAmeWgLSVmSTOGQMtPPRNiKwVmpc+2xKH/Z65sXTvPm6+KQ2PLP7deSTMukYzXJKTxokTBpJcQKb5iySBF1Lts='
//     let buff = Buffer.from(data, 'base64') //new Buffer(data, 'base64');
//     let text_2 = buff.toString('ascii');

//     let iv = text_2.substring(0, 16);
//     let ciphertext = text_2.substring(16)
//     let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
//     decipher.setAutoPadding(false);
//     let decrypted = decipher.update(text_2);

//     decrypted = Buffer.concat([decrypted, decipher.final()]);

//     return decrypted.toString();
// }

// const crypto = require('crypto');

const ivCiphertextB64 = '';
const key = '';

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


console.log(secretKey, data)

// const encrypt = text => {
//     const iv = crypto.randomBytes(16)

//     const cipher = crypto.createCipheriv(algorithm, secretKey, iv)

//     const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

//     return {
//         iv: iv.toString('hex'),
//         content: text.toString('hex')
//     }
// }

// const hash = encrypt(text)


// // let publicKey = '952edf8560a44c06a6956f0bba032fc1'
// const decrypt = hash => {
//     const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))

//     const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

//     return decrpyted.toString()
// }
// // console.log(hash)
// console.log('decrypty', decrypt(hash))