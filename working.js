import crypto from 'crypto'

function decrypt(key, ivCiphertextB64) {
    const ivCiphertext = Buffer.from(ivCiphertextB64, 'base64');
    const iv = ivCiphertext.slice(0, 16);
    const ciphertext = ivCiphertext.slice(16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decryptedData = decipher.update(ciphertext);
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);
    console.log(decryptedData.toString());
}


    let data = `NGKdq8Loexm3K7gesJ8ijAHqaHieWqbPEAmAPSPNoNs6/ES5chIF5vZ+z2hwXHe5N2nFqP0L853SPA1NL/P7TdJ6aAoxsjEpqI7IgHBgjGw3DjaWUmF9+lb+tuS5UDzJwZmtp6N3WDzIi1EX/JzdubjHWIDAfLo+U87GEvaPW4JNcvCzczGlLVteFh0mJdV3fZGJ9tyfJI0I9Q82oWigT6btAt/lbWN2mNSFLN5+LcaS6Exn+RbR7mSDxHacLB92iR2Go8P+/filiKJe9HDOto+Ef4lnLsYad0q8b/LE1OOb2kbz3N4oddujVPN64VmBFXVs+UPHHHVvOi803mbqzsesfBbQn8Du+MI63hcqVhNhojgrD97QA6izrSghUJRB6KSF5xuz/E3hdCKxwHITRceFcf6tCyV11nlqmMO7vbWsFiULwB5SrMXdBB71TJp+/RdP0ZFZCr+Hs+8fhaPhuguCzCPv7IfuIQiI7TR8RHbuPMjJrAcMvEdm9E72w74KlgCzDwldP2fqcOT/v/CJNWEk7ltHgYNrKFX/NkPebxrOEnOMEruk80Paho2lQMyRAD68Ir1zLtcrIwzR2g6vL+BtXcL4mtue+Mf0Bow4zFeY6A0JID6w2KnyAdjbLaNU`

// decrypt('952edf8560a44c06a6956f0bba032fc1', data);

const decodedString = Buffer.from(data, 'base64').toString('utf-8');

console.log(decodedString);