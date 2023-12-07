import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useConnect from "./useConnect";
import idl from "../idl/idl.json";

const useProgram = () => {
  const { connection } = useConnect();
  const gameName = "Guess";

  const wallet = useAnchorWallet();

  const programId = new web3.PublicKey(
    "BwES9u4SUW1qdUeh1riZpUUfaQf1FybrrbTDGfxNiTL2"
  );

  const provider = new AnchorProvider(connection, wallet, {});

  const program = new Program(idl, programId, provider);

  return { gameName, wallet, programId, provider, program };
};

export default useProgram;
