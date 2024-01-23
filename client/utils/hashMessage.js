import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

export function hashMessage(message) {
    const messageBytes = Uint8Array.from(message);
    const hashedMessage = keccak256(messageBytes);
    return hashedMessage;
}