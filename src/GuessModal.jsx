import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  VStack,
  HStack,
  Button,
  Image,
  Text,
  Flex,
} from "@chakra-ui/react";
import qmark from "./assets/qmark.svg";
import { Bounce } from "react-awesome-reveal";
import { useDispatch } from "react-redux";
import { activateWithdraw } from "./slices/WithdrawSlice";

function GuessModal({
  isOpen,
  onClose,
  guessedNum,
  userWon,
  generatedRand,
  displayResult,
}) {
  const dispatch = useDispatch();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size={["xs", "sm"]}
      isCentered
    >
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="6px" />
      <ModalContent
        rounded="2xl"
        color="#111111"
        boxShadow="dark-lg"
        background="linear-gradient(90deg, rgba(153,69,255,1) 0%, rgba(20,241,149,1) 100%)"
        h="320px"
        alignItems="center"
        justifyContent="center"
        bgRepeat="no-repeat"
        fontFamily="mainFont"
        fontSize={["1.2rem", "1.3rem", "1.5rem"]}
      >
        {!displayResult ? (
          <Bounce duration="1000">
            <Flex alignItems="center" justify="center">
              <ModalBody>
                <Image src={qmark} boxSize="44" rounded="2xl"></Image>
              </ModalBody>
            </Flex>
          </Bounce>
        ) : (
          <Bounce duration="1000">
            <ModalBody>
              <VStack spacing="0">
                <VStack spacing="-1">
                  <Text fontWeight="bold">Your guess:</Text>
                  <Text
                    fontWeight="semibold"
                    color="white"
                    textShadow="1px 1px #111111"
                  >
                    {guessedNum}
                  </Text>
                </VStack>
                <VStack spacing="-1">
                  <Text fontWeight="bold">Random number:</Text>
                  <Text
                    fontWeight="semibold"
                    color="white"
                    textShadow="1px 1px #111111"
                  >
                    {generatedRand}
                  </Text>
                </VStack>
                <VStack spacing="-1">
                  <Text fontWeight="bold">Result:</Text>
                  <Text
                    fontWeight="semibold"
                    color="white"
                    textShadow="1px 1px #111111"
                  >
                    {userWon ? "Won" : "Lost"}
                  </Text>
                </VStack>
                <HStack pt={3}>
                  <Button
                    rounded="xl"
                    bg="#14F195"
                    color="#111111"
                    border="none"
                    h="40px"
                    w={["120px", "150px", "150px"]}
                    _hover={{ opacity: "0.85" }}
                    _active={{ opacity: "0.85" }}
                    fontWeight="bold"
                    onClick={() => onClose()}
                  >
                    Try again
                  </Button>
                  <Button
                    rounded="xl"
                    bg="#111111"
                    color="white"
                    h="40px"
                    w={["120px", "150px", "150px"]}
                    border="none"
                    _hover={{ opacity: "0.85" }}
                    _active={{ opacity: "0.85" }}
                    fontWeight="bold"
                    onClick={() => dispatch(activateWithdraw())}
                  >
                    Withdraw
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </Bounce>
        )}
      </ModalContent>
    </Modal>
  );
}
export default GuessModal;
