import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Flex, Link } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { activateBalanceFetch } from "./slices/BalanceFetchSlice";
import { Bounce } from "react-awesome-reveal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useConnect from "./hooks/useConnect";
import { setStateTotalBalance } from "./slices/TotalBalanceSlice";

function Airdrop() {
  const dispatch = useDispatch();

  const { connection, publicKey } = useConnect();

  const totalBalanceState = useSelector((state) => state.totalBalance.value);

  const airDropSucceed = () => toast("Airdrop succeed :)");
  const airDropFailed = () => toast("Airdrop request failed !");

  const getAirdrop = async () => {
    if (connection && publicKey) {
      dispatch(activateBalanceFetch());

      try {
        await connection
          .requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL)
          .then((result) => console.log(result));

        dispatch(setStateTotalBalance(totalBalanceState + 1));
        airDropSucceed();
      } catch (error) {
        airDropFailed();
        console.log(error);
      }
    }
  };

  return (
    <Flex
      w="100%"
      h="30px"
      background="linear-gradient(90deg, rgba(153,69,255,1) 0%, rgba(20,241,149,1) 100%)"
      bgSize="cover"
      justify="center"
      alignItems="center"
    >
      <Bounce>
        <Link
          fontWeight="semibold"
          fontSize={["0.75rem", "0.9rem", "1.1rem"]}
          onClick={connection && publicKey ? () => getAirdrop() : null}
        >
          Get your airdrop SOL to test the game {"->"}
        </Link>
      </Bounce>
    </Flex>
  );
}

export default Airdrop;
