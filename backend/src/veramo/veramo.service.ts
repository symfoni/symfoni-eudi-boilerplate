// Core interfaces
import {
  IDataStore,
  IDIDManager,
  IDIDManagerCreateArgs,
  IKeyManager,
  IResolver,
  TAgent,
  TKeyType,
  VerifiableCredential,
} from "@veramo/core";
import { ICredentialIssuer } from "@veramo/credential-w3c";
// Storage plugin using TypeOrm
import { IDataStoreORM } from "@veramo/data-store";
import { ethers } from "ethers";
// TypeORM is installed with `@veramo/data-store`
import { Connection } from "typeorm";
import { initAgent } from "./veramo.utils";

export class VeramoService {
  private agent!: TAgent<
    IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver & ICredentialIssuer
  >;
  private issuer!: string;

  constructor(private dbConnection: Promise<Connection>) {}

  async init() {
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMNONIC ?? "");
    try {
      if (
        process.env.VERAMO_SECRET_KEY === undefined ||
        process.env.VERIFIER_DID === undefined ||
        process.env.MNEMNONIC === undefined
      ) {
        throw new Error("Need env variables");
      }
      this.agent = initAgent(this.dbConnection, {
        secretKey: process.env.VERAMO_SECRET_KEY,
      });
      this.issuer = process.env.VERIFIER_DID;
    } catch (error) {
      console.error(`VeramAgent error: ${error.message}`);
      throw error;
    }
    try {
      const issuer = await this.agent.didManagerGet({
        did: process.env.VERIFIER_DID,
      });
    } catch (error) {
      console.log(`Verfier DID ${process.env.VERIFIER_DID} not found, creating it now`);
      await this.provisionDb(wallet.privateKey);
    }
  }
  async onModuleDestroy() {
    const connection = await this.dbConnection;
    if (connection) await connection.close();
  }

  async provisionDb(privateKey: string) {
    const res = await this.createIdentityFromEthereumPrivateKey(privateKey, "verifier");
  }

  async createIdentityFromEthereumPrivateKey(privateKey: string, alias: string) {
    if (!privateKey.substr(0, 3).includes("0x"))
      throw Error("Invalid private key as input to createIdentityFromPrivateKey");
    const wallet = new ethers.Wallet(privateKey);
    const privateKeyHex = wallet.privateKey.substr(2);
    const compressedPublicKey = wallet._signingKey().compressedPublicKey;
    return await this.agent.didManagerImport({
      keys: [
        {
          privateKeyHex,
          type: "Secp256k1" as TKeyType,
          kms: "local",
          kid: compressedPublicKey,
        },
      ],
      did: `${process.env.DID_NAMESPACE}:${compressedPublicKey}`,
      controllerKeyId: compressedPublicKey,
      alias,
      provider: process.env.DID_NAMESPACE ?? "",
    });
  }

  async createIdentity(args: IDIDManagerCreateArgs = {}) {
    const identity = await this.agent.didManagerCreate({
      kms: "local",
      ...args,
    });
    return identity;
  }

  async listIdentities() {
    const identifiers = await this.agent.didManagerFind();
    return identifiers;
  }

  async getIssuer() {
    const issuer = await this.agent.didManagerGet({
      did: this.issuer,
    });
    return issuer;
  }

  async issueCredential(data: Record<string, any>, subjectDidId: string, type: string[]) {
    const vc = await this.agent.createVerifiableCredential({
      proofFormat: "jwt",
      save: true,
      credential: {
        type: ["VerifiableCredential", ...type],
        credentialSubject: {
          ...data,
          id: subjectDidId,
        },
        issuer: {
          id: this.issuer,
        },
      },
    });
    return vc;
  }

  async verifyJWT(jwt: string) {
    try {
      await this.agent.handleMessage({
        raw: jwt,
      });
      return true;
    } catch (error) {
      console.log("JWT not valid => ", error);
      return false;
    }
  }

  async validVP(jwt: string) {
    try {
      await this.agent.handleMessage({
        raw: jwt,
      });
      return true;
    } catch (error) {
      console.log("VP not valid => ", error);
      return false;
    }
  }

  async createVerfiablePresentation(
    verifier: string,
    verifiableCredentials: VerifiableCredential[],
  ) {
    const vs = await this.agent.createVerifiablePresentation({
      presentation: {
        holder: this.issuer,
        verifier: [verifier],
        verifiableCredential: verifiableCredentials,
      },
      proofFormat: "jwt",
    });
    return vs;
  }

  async findCredentials(did: string) {
    const credentials = await this.agent.dataStoreORMGetVerifiableCredentials({
      where: [{ column: "subject", value: [did] }],
    });
    return credentials;
  }
}

export interface VerifyOptions {
  audience: string;
  complete: boolean;
  issuer: string | string[];
  ignoreExpiration: boolean;
  ignoreNotBefore: boolean;
  subject: string;
  decodeCredentials: boolean;
  requireVerifiablePresentation: boolean;
}

export interface JwtPayload {
  [key: string]: any;
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}
