import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const useConnect = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return { connection, publicKey };
};

export default useConnect;
