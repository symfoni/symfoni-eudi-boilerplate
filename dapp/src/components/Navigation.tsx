import { sign } from "crypto";
import { Box, Button, Header, ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { SymfoniContext } from "../contexts/SymfoniContext";

interface Props {}

export const Navigation: React.FC<Props> = () => {
  const { signer, closeSigner, initSigner } = useContext(SymfoniContext);

  return (
    <Header background="brand-contrast" pad="small" height={{ min: "15vh" }}>
      <Box>
        <Link to="/">
          <Text>Hjem</Text>
        </Link>
      </Box>
      <Box direction="row" gap="small">
        {signer ? (
          <Button
            onClick={() => closeSigner()}
            size="small"
            label="Koble fra"
            hoverIndicator
            focusIndicator={false}
          />
        ) : (
          <Button
            onClick={() => initSigner()}
            size="small"
            label="Koble til"
            hoverIndicator
            focusIndicator={false}
          />
        )}
      </Box>
    </Header>
  );
};
