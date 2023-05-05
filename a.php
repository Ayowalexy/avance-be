<?php

$ivCiphertextB64 = 'NGKdq8Loexm3K7gesJ8ijKEqJXbQVN01k7t+tkuUGAfYDU2drqycojSbizbKKm8Ya5/U4WJ8QTfVgaOawVs/5KROy06kNHYZaGtSJLu+ZAbA7oeD0eub+YTkrVQLO49qHdeW3YupguYn6eP85n95FuHVJIRDKasMDKCNGAuwvaHp2dijHcruh5o5XGOhrpjPLYsBLQgmY/0n+2uRysPLtBVyvurqmu8WCh15l9IJVPVQQYud/WiZIr6tzQ1vOtnWOM0JYTQF4Pfv5kzC/QqLqVJXCa6LFTsPwEtz5uYKcROuxFc29ct2zimJd2G0jctbHtZUWjK18Dc+yTb6lrg+0FMLbSQXOtHI8rQszquE7fQ+/RNnnHbdkRloy4luVUU7Nda/9bHJ/9qtTmI9diTmGnSh18NLVUuNd1JrsBYbasOsf2bTcpBCTMBHo+ei/HO/0pQLTUulaL4fKDLQfQ1/v8ZDJW1qro2zerxpk6Rwz2f3BNIzLlqL63v95OcuCN2X7+ThkBtudpLJmkW6HPnS9eAmeWgLSVmSTOGQMtPPRNiKwVmpc+2xKH/Z65sXTvPm6+KQ2PLP7deSTMukYzXJKTxokTBpJcQKb5iySBF1Lts=';
$key = '952edf8560a44c06a6956f0bba032fc1';

decrypt($key, $ivCiphertextB64);

function decrypt($key, $ivCiphertextB64){
    $ivCiphertext  = base64_decode($ivCiphertextB64);
    $iv = substr($ivCiphertext, 0, 16);
    $ciphertext = substr($ivCiphertext, 16);
    $decryptedData = openssl_decrypt($ciphertext, "aes-256-cbc", $key, OPENSSL_RAW_DATA, $iv); 
    echo $decryptedData;
}