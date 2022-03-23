import { Box, Button, Heading, Paragraph, Text } from "grommet";
import { LinkNext, UserManager } from "grommet-icons";
import React from "react";
import { Link } from "react-router-dom";

interface Props {}

export const Home: React.FC<Props> = () => {
  return (
    <>
      <Heading level={3}>
        Velkommen til{" "}
        <Text size="xxlarge" weight="bold" style={{ fontStyle: "italic" }}>
          Test dapp
        </Text>
      </Heading>
      <Box direction="row" margin={{ vertical: "large" }}>
        {[
          {
            title: "Logg inn med personnummer",
            icon: <UserManager />,
            description: "Logg inn for å få IdentityCredential",
            buttonText: "Logg inn for credential",
            link: "/credential/identity",
          },
          {
            title: "Send instruks til wallet",
            icon: <UserManager />,
            description: "Send rpc kall til din app og inkrementer state der ",
            buttonText: "Gå til testside for kommunikasjon med in app",
            link: "/test/increment",
          },
          {
            title: "Signer melding i wallet",
            icon: <UserManager />,
            description: "Send rpc kall til wallet og signer med wallet.",
            buttonText: "Gå til testside for kommunikasjon med in app",
            link: "/test/sign",
          },
        ].map((homeAction, index) => {
          return (
            <Box
              key={index}
              direction="column"
              justify="between"
              style={{ minWidth: 300, maxWidth: 300 }}
              border={{ color: "brand", size: "medium" }}
              margin="small"
              pad="medium"
            >
              <Box direction="column">
                <Box direction="row" align="center" justify="around">
                  {homeAction.icon}
                  <Heading level={4}>{homeAction.title}</Heading>
                </Box>
                <Paragraph>{homeAction.description}</Paragraph>
              </Box>
              <Box direction="row" justify="end">
                <Link to={homeAction.link}>
                  <Button size="small" hoverIndicator focusIndicator={false}>
                    <Box
                      border={{ size: "small", color: "brand" }}
                      pad="small"
                      direction="row"
                      align="center"
                      gap="small"
                    >
                      <Text color="black" size="small">
                        {homeAction.buttonText}
                      </Text>
                      <LinkNext size="small" />
                    </Box>
                  </Button>
                </Link>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};
