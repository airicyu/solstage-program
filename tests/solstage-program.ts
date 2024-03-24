import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolstageProgram } from "../target/types/solstage_program";
import { PublicKey } from "@solana/web3.js";
import {sign} from 'crypto'
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import nacl from "tweetnacl";

describe("solstage-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.SolstageProgram as Program<SolstageProgram>;

  it("Is initialized", async () => {
    // Add your test here.
    const [filterSourcePDA, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("filterSource:"),
      provider.wallet.publicKey.toBuffer(),
      anchor.utils.bytes.utf8.encode(":default"),
    ],
    program.programId
    );

    const tx = await program.methods.initialize().accounts({
      filterSource:filterSourcePDA
    }).rpc();
    console.log("Your transaction signature", tx);
  });

  it("Is set filter source", async () => {
    // Add your test here.
    const [filterSourcePDA, _] = await PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("filterSource:"),
      provider.wallet.publicKey.toBuffer(),
      anchor.utils.bytes.utf8.encode(":default"),
    ],
    program.programId
    );

    const sourceSignature = Array.from(nacl.sign.detached(Buffer.from("{}"),(provider.wallet as NodeWallet).payer.secretKey));
    // const sourceSignature = Array.from(sign("X25519", Buffer.from("{}"), Buffer.from((provider.wallet as NodeWallet).payer.secretKey.slice(0,32))))

    const tx = await program.methods.setFilter(
       sourceSignature ,
       "http://localhost:3000/",
    ).accounts({
      filterSource:filterSourcePDA
    }).rpc();
    console.log("Your transaction signature", tx);
  });
});
