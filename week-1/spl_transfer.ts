import { Commitment, Connection, Keypair, PublicKey } from "@solana/web3.js"
import wallet from "../../../../turbine-dev-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);
const tokenDecimals = 1_000_000n;

// Mint address
const mint = new PublicKey("97zqogy3T3mWg329KYfq32krHrNh5j3RegvDHagLraZq");

// Recipient address
const to = new PublicKey("NARN3ege9SzJraDjbNH7u5nU8UVRcwhKAHv4Awixcg4");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toWallet = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);

        // Transfer the new token to the "toTokenAccount" we just created
        const signature = await transfer(connection, keypair, fromTokenAccount.address, toWallet.address, keypair.publicKey, 2n * tokenDecimals);
        console.log(`Your transfer txid: ${signature}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();