import { useMemo, useCallback } from "react";
import { VStack, Flex } from "@chakra-ui/react";

import Navbar from "./Navbar";
import User from "./User";
import Game from "./Game";
import Footer from "./Footer";

import "./css/App.css";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { ToastContainer } from "react-toastify";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new SolflareWalletAdapter(), new TorusWalletAdapter()],
    [network]
  );

  const onError = useCallback((error) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <Flex
          maxH={{ base: "100%", md: "100vh", lg: "100vh", xl: "100%" }}
          minH="100vh"
          h="100%"
          w="100%"
          bg="#111111"
          className="App"
          direction="column"
        >
          <Navbar />
          <VStack spacing={3.5} pt={[16, 14, 10]}>
            <User />
            <Game />
          </VStack>
          <Footer />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            toastStyle={{
              backgroundColor: "#212121",
              borderRadius: "0.6rem",
              fontFamily: "mainFont",
              fontSize: "1rem",
            }}
            progressStyle={{
              background:
                "linear-gradient(90deg, hsla(267, 100%, 64%, 1) 0%, hsla(155, 89%, 51%, 1) 100%)",
            }}
          />
        </Flex>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
