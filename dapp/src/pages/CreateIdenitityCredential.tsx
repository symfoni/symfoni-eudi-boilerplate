import axios from "axios";
import { Box, Button, Heading, Text, TextInput } from "grommet";
import { err } from "neverthrow";
import { useState } from "react";
import { useSign } from "../contexts/useSign";
import { useSymfoni } from "../contexts/useSymfoni";

interface Props {}

export const CreateIdentityCredential: React.FC<Props> = ({ ...props }) => {
  const { signer } = useSymfoni();
  const [personnummer, setPersonnummer] = useState("");
  const [error, setError] = useState("");
  const { sign } = useSign();

  const fetchIdentityCredential = async () => {
    console.log("getting vc for personnummer", personnummer);
    try {
      const res = await axios.post(`http://localhost:3001/credential/identity/${personnummer}`);
      const vc = res.data;
      const resFromWallet = await sign<{ saved: Boolean }>(
        "test_saveId",
        "Save your identity in your wallet. Confirm in wallet",
        [vc],
      );
      console.log("res from wallet", resFromWallet);
    } catch (e: any) {
      console.error("Something went wrong when getting credetnail", e);
      setError(e.message);
    }
  };

  const inputOnChange = (event: string) => {
    if (error !== "") {
      setError("");
    }
    setPersonnummer(event);
  };

  return (
    <Box>
      <Heading level={2}>Logg inn for å få IdentityCredential</Heading>
      {!signer ? (
        <Text>You must be connected to your wallet to do this</Text>
      ) : (
        <>
          <Button primary type="button" onClick={() => fetchIdentityCredential()}>
            Signer personummer
          </Button>
          {error !== "" && <Text>Noe gikk galt: {error}</Text>}
          <TextInput
            placeholder="Personummer"
            type="number"
            value={personnummer}
            onChange={event => inputOnChange(event.target.value)}
          />
        </>
      )}
    </Box>
  );
};
