import { Flex, Text, VStack, HStack } from "@chakra-ui/react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "./css/Wallet.css";
import Airdrop from "./Airdrop";

function Navbar() {
  return (
    <WalletModalProvider>
      <Flex fontFamily="mainFont">
        <VStack w="100%">
          <Airdrop />
          <Flex justifyContent="space-between" p={2} pl={4} pr={4} w="100%">
            <HStack>
              <Text
                color="#9945FF"
                fontWeight="bold"
                fontSize={["1.3rem", "1.4rem", "1.5rem"]}
              >
                Guessing Game
              </Text>
              <Text
                color="#9945FF"
                fontWeight="normal"
                fontSize={["0.4rem", "0.5rem", "0.6rem"]}
                display={["none", "flex"]}
              >
                on Solana Devnet
              </Text>
            </HStack>

            <WalletMultiButton />
          </Flex>
        </VStack>
      </Flex>
    </WalletModalProvider>
  );
}

export default Navbar;
