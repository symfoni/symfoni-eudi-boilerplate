import { config } from "dotenv";
import { Application } from "express";
import * as request from "supertest";
import { Connection } from "typeorm";
import { createServer } from "../server";
import { VeramoService } from "../veramo/veramo.service";
import { getDbConnection } from "../veramo/veramo.utils";
import { ethers } from "ethers";
config({ path: ".env" });
const nameClaim = { name: "Ola Nordman" };
const ageClaim = { age: 22 };
describe("e2e", () => {
  let application: Application;
  let veramo: VeramoService;
  let dbConnection: Promise<Connection>;

  beforeAll(async () => {
    dbConnection = getDbConnection("test.db.sqlite");
    const { veramoService, app } = await createServer(dbConnection);
    veramo = veramoService;
    application = app;
  });
  describe("Test the root path", () => {
    it("Should have a valid identity", async () => {
      const identity = (await veramo.listIdentities())[0];
      const mnemnomic = process.env.MNEMNONIC;
      if (!mnemnomic) throw Error("set mnemnomic in env");
      const wallet = ethers.Wallet.fromMnemonic(mnemnomic);

      expect(identity.did).toContain("did");
      expect(
        wallet._signingKey().compressedPublicKey ===
          identity.did.split(":").pop()
      ).toBeTruthy();
    });

    it("Should be able to query issued vc", async () => {
      const subject = `${process.env.DID_NAMESPACE}}:0x0260cc4eb9ce0614f920d3f47cfe4a5b177d64a00e04c50fdf392b1ada891aa675`;
      const vc = await veramo.issueCredential(nameClaim, subject, [
        "PersonCredential",
      ]);

      const queryResult = await veramo.findCredentials(subject);
      expect(queryResult.length).toBe(1);
    });

    it("Should be able to verify VP", async () => {
      const subject = `${process.env.DID_NAMESPACE}}:0x0260cc4eb9ce0614f920d3f47cfe4a5b177d64a00e04c50fdf392b1ada891aa675`;
      const vc = await veramo.issueCredential(nameClaim, subject, [
        "PersonCredential",
      ]);

      const issuer = await veramo.getIssuer();
      const validVC = await veramo.verifyJWT(vc.proof.jwt);

      expect(vc.issuer.id).toBe(issuer.did);
      expect(vc.credentialSubject.id).toBe(subject);
      expect(validVC).toBe(true);
    });

    it("should get vc for the only personnummer in our mock db", async () => {
      const response = await request(application)
        .post("/credential/identity/12345678910")
        .expect(200);
      const { jwt } = response.body.proof;
      const isValid = await veramo.verifyJWT(jwt);
      expect(isValid).toBeTruthy();
    });

    it("should be able to get an employee credential in exhange for an identity credential", async () => {
      const identityVcRes = await request(application)
        .post("/credential/identity/12345678910")
        .expect(200);

      const employeeVcRes = await request(application)
        .post("/credential/employee/")
        .send({ jwt: identityVcRes.body.proof.jwt });

      console.log(employeeVcRes.body);
      const { jwt } = employeeVcRes.body.proof;

      const isValid = await veramo.verifyJWT(jwt);
      expect(isValid).toBeTruthy();
    });
  });
});
