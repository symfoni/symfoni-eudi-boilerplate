import { Box, Button, Heading, Text } from "grommet";
import { useSign } from "../contexts/useSign";
import { useSymfoni } from "../contexts/useSymfoni";

interface Props {}

export const Increment: React.FC<Props> = ({ ...props }) => {
  const { signer } = useSymfoni();
  const { sign } = useSign();

  const sendRPC = async (method: string) => {
    if (signer === undefined) {
      console.log("signer is undefined. Should not be if connected");
      return;
    }
    if (!("request" in signer)) {
      require("debug")("context:useSign().sign()")(`connect(): !("request" in signer")`);
      return null;
    }
    return await signer.request(method, []);
  };

  const incrementInWallet = () => {
    sendRPC("test_increment");
  };

  return (
    <Box>
      <Heading level={2}>Increment state in wallet</Heading>
      <Button primary type="button" onClick={() => incrementInWallet()}>
        Increment
      </Button>
      {!signer && <Text>You must be connected to your wallet to do this</Text>}
    </Box>
  );
};
