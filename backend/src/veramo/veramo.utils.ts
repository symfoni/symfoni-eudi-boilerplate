// Core interfaces
import { createAgent, IDataStore, IDIDManager, IKeyManager, IResolver, TAgent } from "@veramo/core";
import { CredentialIssuer, ICredentialIssuer, W3cMessageHandler } from "@veramo/credential-w3c";
// Storage plugin using TypeOrm
import {
  DataStore,
  DataStoreORM,
  DIDStore,
  Entities,
  IDataStoreORM,
  KeyStore,
  migrations,
  PrivateKeyStore,
} from "@veramo/data-store";
import { JwtMessageHandler } from "@veramo/did-jwt";
import { DIDManager } from "@veramo/did-manager";
import { EthrDIDProvider } from "@veramo/did-provider-ethr";
// Custom resolvers
import { DIDResolverPlugin } from "@veramo/did-resolver";
// Core key manager plugin
import { KeyManager } from "@veramo/key-manager";
// Custom key management system for RN
import { KeyManagementSystem, SecretBox } from "@veramo/kms-local";
// Core identity manager plugin
import { MessageHandler } from "@veramo/message-handler";
import { Resolver } from "did-resolver";
import { ethers } from "ethers";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
// TypeORM is installed with `@veramo/data-store`
import { Connection, createConnection } from "typeorm";

export function getDbConnection(databaseFileName: string) {
  return createConnection({
    migrations,
    migrationsRun: true,
    type: "sqlite",
    database: process.env.NODE_ENV !== "production" ? ":memory:" : databaseFileName,
    synchronize: false,
    logging: ["error", "info", "warn"],
    entities: Entities,
    name: databaseFileName,
  });
}

export function getAgentConfig(
  dbConnection: Promise<Connection>,
  defaultDidProvider: string,
  secretKey?: string,
) {
  return {
    plugins: [
      new KeyManager({
        store: new KeyStore(dbConnection),
        kms: {
          local: new KeyManagementSystem(
            new PrivateKeyStore(dbConnection, secretKey ? new SecretBox(secretKey) : undefined),
          ),
        },
      }),
      new DIDManager({
        store: new DIDStore(dbConnection),
        defaultProvider: defaultDidProvider,
        providers: {
          "did:ethr:421611": new EthrDIDProvider({
            defaultKms: "local",
            network: parseInt(process.env.PROVIDER_NETWORK ?? ""),
            registry: "0xbBe762c149f424AD15E23f0a25a01F75f491D697",
            rpcUrl: process.env.PROVIDER_URL,
          }),
        },
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...ethrDidResolver({
            provider: new ethers.providers.JsonRpcProvider({
              url: process.env.PROVIDER_URL ?? "",
            }),
            registry: "0xbBe762c149f424AD15E23f0a25a01F75f491D697",
            chainId: parseInt(process.env.PROVIDER_NETWORK ?? ""),
            name: process.env.PROVIDER_NETWORK ?? "",
          }),
        }),
      }),
      new CredentialIssuer(),
      new MessageHandler({
        messageHandlers: [new JwtMessageHandler(), new W3cMessageHandler()],
      }),
      new DataStore(dbConnection),
      new DataStoreORM(dbConnection),
    ],
  };
}

export function initAgent(
  dbConnection: Promise<Connection>,
  _args: {
    defaultDidProvider?: string;
    secretKey?: string;
  } = {},
): VeramoAgent {
  const args = { defaultDidProvider: process.env.DID_NAMESPACE ?? "", ..._args };
  const agentConfig = getAgentConfig(dbConnection, args.defaultDidProvider, args.secretKey);
  return createAgent<
    IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver & ICredentialIssuer
  >(agentConfig);
}

export type VeramoAgent = TAgent<
  IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver & ICredentialIssuer
>;
