import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../../../turbine-dev-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    let tx = createNft(umi, {
        mint,
        name: "Divine Rug",
        symbol: "DR",
        uri: "https://devnet.irys.xyz/BCsR5qmKH37Zw1NgXrKyTVZd3Ph7Hjc7BK99NoriSRza",
        sellerFeeBasisPoints: percentAmount(5),
        creators: [
            {
                address: keypair.publicKey,
                verified: true,
                share: 100,
            }
        ],
    })
    let result = await tx.sendAndConfirm(umi, {
        send: {
            commitment: 'confirmed',
        },
    });
    const signature = base58.encode(result.signature);
    
    console.log(`Successfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();