import { useState } from "react";
import {
  Button,
  VStack,
  Input,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import useConnect from "./hooks/useConnect";
import { web3, BN } from "@coral-xyz/anchor";
import useBalance from "./hooks/useBalance";
import useProgram from "./hooks/useProgram";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import GuessModal from "./GuessModal";
import Withdraw from "./Withdraw";
import { useDispatch } from "react-redux";
import { deActivateBalanceFetch } from "./slices/BalanceFetchSlice";
import { toast } from "react-toastify";
window.Buffer = window.Buffer || require("buffer").Buffer;

function Client() {
  const { connection, publicKey } = useConnect();
  const { totalBalanceState } = useBalance();

  const { gameName, wallet, program } = useProgram();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [guessedNum, setGuessedNum] = useState("");

  const [amountSelected, setAmountSelected] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const depositHandler = (amount) => {
    setAmountSelected(amount);
    setDeposit(amount * LAMPORTS_PER_SOL);
  };

  const [userWon, setUserWon] = useState(0);

  const [generatedRand, setGeneratedRand] = useState(0);

  const [displayResult, setDisplayResult] = useState(false);

  const dispatch = useDispatch();

  const insufficientBalance = () =>
    toast("Insufficient balance! Please top up your SOL balance...");

  const invalidNumber = () => {
    toast("Your guess must be between 0-5 !");
  };

  const interact = async () => {
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

    const vaultData = await program.account.gameVault.fetch(VAULT_PDA);
    let vaultGameId = vaultData.gameId;
    console.log("Current game ID is: " + vaultGameId);

    const latestBlockhash = await connection.getLatestBlockhash("finalized");

    if (totalBalanceState >= 0.06) {
      if (guessedNum >= 0 && guessedNum <= 5) {
        try {
          dispatch(deActivateBalanceFetch());

          const finalDeposit = new BN(deposit);

          let indexRand = Math.floor(Math.random() * 101);

          const tx = await program.methods
            .makeGuess(guessedNum, finalDeposit)
            .accounts({
              guess: GUESS_PDA,
              gameVault: VAULT_PDA,
            })
            .postInstructions([
              await program.methods
                .generateRandom(indexRand)
                .accounts({
                  newResult: RESULT_PDA,
                  guess: GUESS_PDA,
                  gameVault: VAULT_PDA,
                })
                .instruction(),
            ])
            .rpc();

          onOpen();

          await connection.confirmTransaction({
            signature: tx,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          });

          console.log(`https://solscan.io/tx/${tx}?cluster=devnet`);

          const resultData = await program.account.newResult.fetch(RESULT_PDA);

          if (resultData.betResult) {
            setGeneratedRand(resultData.generatedRand.toString());
            if (resultData.betResult == "Won") {
              setUserWon(true);
            } else {
              setUserWon(false);
            }
            setDisplayResult(true);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        invalidNumber();
      }
    } else {
      insufficientBalance();
    }
  };

  return (
    <VStack spacing={3}>
      <Input
        type="number"
        rounded="xl"
        w="150px"
        color="white"
        value={guessedNum}
        onChange={(event) => setGuessedNum(event.target.value)}
        placeholder="Your guess"
        focusBorderColor="#9945FF"
        _placeholder={{ opacity: "0.5", color: "white" }}
        fontSize={["1rem", "1.2rem", "1.3rem"]}
        fontWeight="semibold"
        isDisabled={!connection || !publicKey}
      ></Input>

      <Text
        color="white"
        fontSize={["0.9rem", "1.2rem", "1.4rem"]}
        fontWeight="bold"
      >
        Choose how much deposit
      </Text>
      <HStack>
        <Button
          bg={amountSelected == 0.05 ? "#14F195" : "#212121"}
          color={amountSelected == 0.05 ? "#111111" : "white"}
          rounded="xl"
          border="1px solid #14F195"
          _hover={{ opacity: "0.75" }}
          _active={{}}
          _focus={{ bg: "#14F195", color: "#111111" }}
          fontSize={["1rem", "1.1rem", "1.2rem"]}
          fontWeight="semibold"
          w={[90, 100, 100]}
          onClick={() => depositHandler(0.05)}
          isDisabled={!connection || !publicKey}
        >
          0.05 SOL
        </Button>
        <Button
          bg={amountSelected == 0.1 ? "#14F195" : "#212121"}
          color={amountSelected == 0.1 ? "#111111" : "white"}
          rounded="xl"
          border="1px solid #14F195"
          _hover={{ opacity: "0.75" }}
          _active={{}}
          _focus={{ bg: "#14F195", color: "#111111" }}
          fontSize={["1rem", "1.1rem", "1.2rem"]}
          fontWeight="semibold"
          w={[90, 100, 100]}
          onClick={() => depositHandler(0.1)}
          isDisabled={!connection || !publicKey}
        >
          0.1 SOL
        </Button>
      </HStack>
      <HStack>
        <Button
          bg={amountSelected == 0.5 ? "#14F195" : "#212121"}
          color={amountSelected == 0.5 ? "#111111" : "white"}
          rounded="xl"
          border="1px solid #14F195"
          _hover={{ opacity: "0.75" }}
          _active={{}}
          _focus={{ bg: "#14F195", color: "#111111" }}
          fontSize={["1rem", "1.1rem", "1.2rem"]}
          fontWeight="semibold"
          w={[90, 100, 100]}
          onClick={() => depositHandler(0.5)}
          isDisabled={!connection || !publicKey}
        >
          0.5 SOL
        </Button>
        <Button
          bg={amountSelected == 1 ? "#14F195" : "#212121"}
          color={amountSelected == 1 ? "#111111" : "white"}
          rounded="xl"
          border="1px solid #14F195"
          _hover={{ opacity: "0.75" }}
          _active={{}}
          _focus={{ bg: "#14F195", color: "#111111" }}
          fontSize={["1rem", "1.1rem", "1.2rem"]}
          fontWeight="semibold"
          w={[90, 100, 100]}
          onClick={() => depositHandler(1)}
          isDisabled={!connection || !publicKey}
        >
          1 SOL
        </Button>
      </HStack>

      <Button
        rounded="xl"
        border="none"
        color="#111111"
        background="linear-gradient(90deg, rgba(153,69,255,1) 0%, rgba(20,241,149,1) 54%)"
        _hover={{ opacity: "0.75" }}
        _active={{ opacity: "0.75" }}
        fontSize={["1rem", "1.2rem", "1.3rem"]}
        fontWeight="bold"
        isDisabled={!connection || !publicKey || !guessedNum}
        onClick={() => interact()}
      >
        Make a guess!
      </Button>
      <GuessModal
        isOpen={isOpen}
        onClose={onClose}
        guessedNum={guessedNum}
        generatedRand={generatedRand}
        userWon={userWon}
        displayResult={displayResult}
      />
      <Withdraw />
    </VStack>
  );
}

export default Client;
