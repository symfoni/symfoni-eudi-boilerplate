import { Box, Button, Heading, Text, TextInput } from "grommet";
import { useState } from "react";
import { useSign } from "../contexts/useSign";
import { useSymfoni } from "../contexts/useSymfoni";

interface Props {}

export const Sign: React.FC<Props> = ({ ...props }) => {
  const { signer } = useSymfoni();
  const { sign } = useSign();
  const [messageToSign, setMessageToSign] = useState("");

  const signMessage = async (message: string) => {
    console.log("message to sign", message);
    const result = await sign<{ signedMessage: string }>(
      "test_sign",
      "Signer meldingen din i wallet",
      [
        {
          messageToSign: message,
        },
      ],
    );
    console.log("result sign message", result);
  };

  return (
    <Box>
      <Heading level={2}>Increment state in wallet</Heading>
      <Button primary type="button" onClick={() => signMessage(messageToSign)}>
        Signer melding
      </Button>
      <TextInput
        placeholder="Message to sign here"
        value={messageToSign}
        onChange={event => setMessageToSign(event.target.value)}
      />
      {!signer && <Text>You must be connected to your wallet to do this</Text>}
    </Box>
  );
};
