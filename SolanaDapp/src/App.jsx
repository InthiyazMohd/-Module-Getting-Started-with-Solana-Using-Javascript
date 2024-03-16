import {
  Connection,
  Keypair,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Buffer } from "buffer";

function App() {
  window.Buffer = Buffer;
  const [Toadd, setToadd] = useState("");
  const [Fromadd, setFromadd] = useState("");
  const [keypair, setkeypair] = useState();
  const [connection, setConnection] = useState();

  const ConnectWallet = async () => {
    const { solana } = window;
    if (solana) {
      try {
        const response = await solana.connect();
        console.log(response.publicKey.toString());
        setToadd(response.publicKey.toString());
      } catch (err) {
        console.error(err);
      }
    }
  };

  const Transfer = async () => {
    console.log("Transfer method invoked");

    try {
      console.log("trying.....");
      const transaction = new Transaction();
      const instruction = SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: Toadd,
        lamports: 1 * LAMPORTS_PER_SOL,
      });
      transaction.add(instruction);

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
      );

      console.log("Transaction Signature:", signature);
    } catch (err) {
      console.error(err);
    }
  };
  const CreateKeyPair = async () => {
    const keypair = Keypair.generate();
    setkeypair(keypair);
    const pubkey = keypair.publicKey.toString();
    console.log("PublicKey :", pubkey);
    setFromadd(pubkey);
    const con = new Connection("http://127.0.0.1:8899", "confirmed");
    setConnection(con);
    try {
      let airdropSignature = await connection.requestAirdrop(
        keypair.publicKey,
        2 * LAMPORTS_PER_SOL
      );

      await connection.confirmTransaction({ signature: airdropSignature });

      console.log(" Airdropped 2 SOl ");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={ConnectWallet}>
        Connect Wallet
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={CreateKeyPair}
      >
        CreateAccount
      </button>
      <button type="button" className="btn btn-success" onClick={Transfer}>
        Transfer
      </button>
    </>
  );
}

export default App;
