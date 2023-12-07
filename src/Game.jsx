import { Flex, Text, HStack, VStack } from "@chakra-ui/react";

import Client from "./Client";

function Game() {
  return (
    <Flex
      align="center"
      justify="center"
      background="linear-gradient(90deg, rgba(153,69,255,1) 0%, rgba(20,241,149,1) 54%)"
      h="390px"
      w={[360, 390, 492]}
      borderRadius="xl"
      fontSize={["1rem", "1.2rem", "1.4rem"]}
    >
      <Flex
        position="relative"
        h="99.5%"
        w="99.5%"
        align="center"
        justify="center"
        fontFamily="mainFont"
        bg="#181818"
        borderRadius="xl"
      >
        <VStack>
          <VStack spacing="-1">
            <HStack>
              <Text color="white" fontWeight="bold">
                I'm thinking of a number between
              </Text>
              <Text
                bgGradient="linear-gradient(90deg, hsla(267, 100%, 64%, 1) 0%, hsla(155, 89%, 51%, 1) 100%)"
                bgClip="text"
                fontWeight="bold"
              >
                0-5
              </Text>
            </HStack>
            <Text color="#14F195" fontWeight="bold">
              Can you guess it?
            </Text>
          </VStack>

          <Client />
        </VStack>
      </Flex>
    </Flex>
  );
}

export default Game;
