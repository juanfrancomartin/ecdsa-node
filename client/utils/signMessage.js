import {secp256k1} from  "ethereum-cryptography/secp256k1";
import {hashMessage} from './hashMessage';

export async function signMessage(msg, privateKey) {
    const hashedMessage = hashMessage(msg);
    const signedMessage = await secp256k1.sign(hashedMessage, privateKey)
    return signedMessage;
}
