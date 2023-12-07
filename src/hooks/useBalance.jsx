import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import useConnect from "./useConnect";
import { setStateTotalBalance } from "../slices/TotalBalanceSlice";

const useBalance = () => {
  const { connection, publicKey } = useConnect();

  const dispatch = useDispatch();
  const balanceState = useSelector((state) => state.balanceFetch.value);
  const totalBalanceState = useSelector((state) => state.totalBalance.value);

  const fetchBalance = async () => {
    await connection
      .getAccountInfo(publicKey)
      .then((result) =>
        dispatch(setStateTotalBalance(result.lamports / LAMPORTS_PER_SOL))
      );
  };

  useEffect(() => {
    if (connection && publicKey && !balanceState) {
      try {
        fetchBalance();
      } catch (error) {
        console.log(error);
      }
    }
  });

  return { totalBalanceState };
};

export default useBalance;
