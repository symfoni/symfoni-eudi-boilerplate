import { Grommet } from "grommet";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import App from "./App";
import { SignatureRequestModal } from "./components/SignatureRequestModal";
import { SymfoniProvider } from "./contexts/SymfoniContext";

declare global {
  // tslint:disable-next-line
  interface Window {
    blockies: any;
  }
}

ReactDOM.render(
  <>
    <SymfoniProvider>
      <Grommet>
        <App />
        <SignatureRequestModal />
      </Grommet>
    </SymfoniProvider>
  </>,
  document.getElementById("root"),
);
