import { useState } from "react";
import server from "./server";
import {signMessage} from "../utils/signMessage";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const stringifyBigInts = obj =>{
    for(let prop in obj){
      let value = obj[prop];
      if(typeof value === 'bigint'){
        obj[prop] = value.toString();
      }else if(typeof value === 'object' && value !== null){
        obj[prop] = stringifyBigInts(value);
      }
    }
    return obj;
  }

  async function transfer(evt) {
    console.log("transfer", privateKey)
    evt.preventDefault();

    try {
      const message = {amount: parseInt(sendAmount), recipient}
      const signature = await signMessage(message, privateKey)
      console.log("message", JSON.stringify(stringifyBigInts(signature)))
      console.log("signature", signature)
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: stringifyBigInts(signature),
        message,
        sender: address
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
