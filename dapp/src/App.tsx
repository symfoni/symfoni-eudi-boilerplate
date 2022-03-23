import { Grommet, Main } from "grommet";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { SignatureRequestModal } from "./components/SignatureRequestModal";
import { SymfoniProvider } from "./contexts/SymfoniContext";
import { CreateIdentityCredential } from "./pages/CreateIdenitityCredential";
import { Home } from "./pages/Home";
import { Increment } from "./pages/Increment";
import { Sign } from "./pages/Sign";

export default function App() {
  return (
    <BrowserRouter>
      <SymfoniProvider>
        <Grommet>
          <Navigation></Navigation>
          <Main pad="xlarge" height={{ min: "75vh" }}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/credential/identity" component={CreateIdentityCredential} />
              <Route path="/test/increment" component={Increment} />
              <Route path="/test/sign" component={Sign} />
            </Switch>
          </Main>
          <SignatureRequestModal />
        </Grommet>
      </SymfoniProvider>
    </BrowserRouter>
  );
}
