import { Flex } from "@chakra-ui/react";

function Footer() {
  return (
    <Flex
      alignItems="center"
      justify="center"
      color="white"
      fontFamily="mainFont"
      fontSize="0.8rem"
      fontWeight="normal"
      opacity="0.22"
      pt={[8, 12, 16]}
    >
      Experimental Solana dApp. Not for commercial use.
    </Flex>
  );
}

export default Footer;
