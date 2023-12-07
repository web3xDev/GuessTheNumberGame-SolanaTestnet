import useProgram from "./useProgram";
import useConnect from "./useConnect";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStatePrizeFetch } from "../slices/PrizeSlice";
import { web3 } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const usePrize = () => {
  const { connection, publicKey } = useConnect();
  const { gameName, wallet, program } = useProgram();

  const dispatch = useDispatch();
  const prizeState = useSelector((state) => state.prize.value);

  useEffect(() => {
    const fetchPrize = async () => {
      if (connection && publicKey) {
        try {
          const [VAULT_PDA] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from(gameName)],
            program.programId
          );

          const [GUESS_PDA] = web3.PublicKey.findProgramAddressSync(
            [
              Buffer.from(gameName),
              VAULT_PDA.toBuffer(),
              wallet.publicKey.toBuffer(),
            ],
            program.programId
          );

          const [RESULT_PDA] = web3.PublicKey.findProgramAddressSync(
            [
              Buffer.from(gameName),
              GUESS_PDA.toBuffer(),
              wallet.publicKey.toBuffer(),
            ],
            program.programId
          );
          const resultData = await program.account.newResult.fetch(RESULT_PDA);
          //console.log(resultData.totalAmount.toString());

          const resultLamports = resultData.totalAmount / LAMPORTS_PER_SOL;

          dispatch(setStatePrizeFetch(resultLamports.toString()));
          //console.log(prizeState);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchPrize();
  });

  return { prizeState };
};

export default usePrize;
