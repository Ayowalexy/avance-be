import crypto from 'crypto';
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);


let text = 'NGKdq8Loexm3K7gesJ8ijKEqJXbQVN01k7t+tkuUGAfYDU2drqycojSbizbKKm8Ya5/U4WJ8QTfVgaOawVs/5KROy06kNHYZaGtSJLu+ZAbA7oeD0eub+YTkrVQLO49qHdeW3YupguYn6eP85n95FuHVJIRDKasMDKCNGAuwvaHp2dijHcruh5o5XGOhrpjPLYsBLQgmY/0n+2uRysPLtBVyvurqmu8WCh15l9IJVPVQQYud/WiZIr6tzQ1vOtnWOM0JYTQF4Pfv5kzC/QqLqVJXCa6LFTsPwEtz5uYKcROuxFc29ct2zimJd2G0jctbHtZUWjK18Dc+yTb6lrg+0FMLbSQXOtHI8rQszquE7fQ+/RNnnHbdkRloy4luVUU7Nda/9bHJ/9qtTmI9diTmGnSh18NLVUuNd1JrsBYbasOsf2bTcpBCTMBHo+ei/HO/0pQLTUulaL4fKDLQfQ1/v8ZDJW1qro2zerxpk6Rwz2f3BNIzLlqL63v95OcuCN2X7+ThkBtudpLJmkW6HPnS9eAmeWgLSVmSTOGQMtPPRNiKwVmpc+2xKH/Z65sXTvPm6+KQ2PLP7deSTMukYzXJKTxokTBpJcQKb5iySBF1Lts='

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
 }
 

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from('952edf8560a44c06a6956f0bba032fc1'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
 }

 var hw = encrypt("Welcome to Tutorials Point...")
 console.log(hw)
 console.log(decrypt(hw))