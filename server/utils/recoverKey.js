const {secp256k1} = require("ethereum-cryptography/secp256k1");

async function recoverKey(message, signature, recoveryBit) {
    const publicKey = await secp256k1.Signature("hi",signature,recoveryBit);
    return publicKey;
}