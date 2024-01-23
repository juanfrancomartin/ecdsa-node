const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {secp256k1} = require("ethereum-cryptography/secp256k1");
const {keccak256} = require('ethereum-cryptography/keccak');

app.use(cors());
app.use(express.json());

const balances = {
  "023acab954ebc660ef5ae3872bcbfe804849702f068b399df9a9eedce537881521": 100,
  "03a0aaa498e9263dd4af81baca39c513bc6b119c9920fdc477646872bc11a52c9f": 50,
  "022ccdfadfec1c7920567b486af0ada2b93c1d88e17e62d79fb9dbbba46fd8a148": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { signature, message, sender } = req.body;
  const { recipient, amount } = message;

  // convert stringified bigints back to bigints
  const sig = {
    ...signature,
    r: BigInt(signature.r),
    s: BigInt(signature.s)
  }

  const hashMessage = (message) => keccak256(Uint8Array.from(message));
  const isValid = secp256k1.verify(sig, hashMessage(message), sender) === true;

  if(!isValid) return res.status(400).send({ message: "Bad signature!"});
  
  if(!balances[recipient]) return res.status(400).send({ message: "Invalid recipient!"});

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
