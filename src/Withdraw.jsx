import { web3 } from "@coral-xyz/anchor";
import useConnect from "./hooks/useConnect";
import useProgram from "./hooks/useProgram";
import { useSelector, useDispatch } from "react-redux";
import { deActivateWithdraw } from "./slices/WithdrawSlice";
import { setStatePrizeFetch } from "./slices/PrizeSlice";
import { toast } from "react-toastify";

function Withdraw() {
  const dispatch = useDispatch();
  const withdrawState = useSelector((state) => state.withdraw.value);

  const prizeState = useSelector((state) => state.prize.value);

  const withdrawSucceed = () => toast("Withdraw succeed :)");
  const withdrawFailed = () => toast("Withdraw request failed!");

  const { gameName, wallet, program } = useProgram();
  const { connection } = useConnect();

  if (withdrawState) {
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

    const withdrawTx = async () => {
      const latestBlockhash = await connection.getLatestBlockhash("finalized");

      const tx = await program.methods
        .claimReward()
        .accounts({
          newResult: RESULT_PDA,
          guess: GUESS_PDA,
          gameVault: VAULT_PDA,
        })
        .rpc();

      await connection.confirmTransaction({
        signature: tx,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      console.log(`https://solscan.io/tx/${tx}?cluster=devnet`);
    };

    try {
      if (prizeState != 0) {
        withdrawTx();
        withdrawSucceed();
        dispatch(setStatePrizeFetch(0));
      } else {
        withdrawFailed();
      }
      dispatch(deActivateWithdraw());
    } catch (error) {
      console.log(error);
    }
  }

  return <div></div>;
}

export default Withdraw;
