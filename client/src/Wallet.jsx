import server from "./server";
import {secp256k1} from  "ethereum-cryptography/secp256k1";
import {toHex} from"ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const key = evt.target.value;
    setPrivateKey(key);
    let publicKey = null;
    try{
      publicKey = toHex(secp256k1.getPublicKey(key));
      setAddress(publicKey)
    }catch(ex){
      console.log(ex)
      setAddress(null)
    }
    if (publicKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${publicKey}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type in a private key" value={privateKey} onChange={onChange}></input>
      </label>
      <div>Address: {address ?? 'invalid'}</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
