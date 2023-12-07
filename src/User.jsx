import { Flex, Text, VStack, HStack, Box } from "@chakra-ui/react";

import useBalance from "./hooks/useBalance";

import useConnect from "./hooks/useConnect";

import usePrize from "./hooks/usePrize";

function User() {
  const { totalBalanceState } = useBalance();

  const { connection, publicKey } = useConnect();

  const { prizeState } = usePrize();

  return (
    <Flex
      align="center"
      justify="center"
      background="linear-gradient(90deg, rgba(153,69,255,1) 0%, rgba(20,241,149,1) 54%)"
      h="93px"
      w={[360, 390, 492]}
      borderRadius="xl"
      fontSize={["1rem", "1.2rem", "1.4rem"]}
    >
      <Flex
        position="relative"
        h="99%"
        w="99.5%"
        align="center"
        justify="center"
        fontFamily="mainFont"
        bg="#181818"
        borderRadius="xl"
      >
        <VStack spacing="-2">
          <HStack>
            <Text color="white" fontWeight="bold">
              User Balance:
            </Text>
            <Text color="#14F195" fontWeight="bold">
              {publicKey && connection
                ? `${totalBalanceState} SOL`
                : "Not connected"}
            </Text>
          </HStack>
          <HStack>
            <Text color="white" fontWeight="bold">
              Total Prize:
            </Text>
            <Text color="#14F195" fontWeight="bold">
              {connection && publicKey && prizeState
                ? prizeState + " SOL"
                : connection && publicKey && !prizeState
                ? "0 SOL"
                : !(connection && publicKey)
                ? "Not connected"
                : null}
            </Text>
          </HStack>
        </VStack>
      </Flex>
    </Flex>
  );
}

export default User;
