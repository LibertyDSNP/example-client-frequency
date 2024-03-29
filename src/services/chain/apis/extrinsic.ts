import {
  requireGetProviderApi,
  requireGetServiceKeys,
  requireGetServiceMsaId,
  requireGetSigner,
  requireGetWallet,
} from "../../config";
import { DelegateData, DsnpCallback, DsnpErrorCallback } from "./common";
import { SignerPayloadRaw } from "@polkadot/types/types";
import { KeyringPair } from "@polkadot/keyring/types";
import {
  BlockPaginationResponseMessage,
  MessageResponse,
} from "@frequency-chain/api-augment/interfaces";
import { SchemaDetails } from "../../types";
import { EventRecord } from "@polkadot/types/interfaces";

const checkForFailedEvent = (
  events: Array<EventRecord>
): string | undefined => {
  let failedData: string | undefined;
  events.forEach(({ phase, event: { data, method, section } }) => {
    if (method === "ExtrinsicFailed") {
      console.log("data: ", data);
      failedData = data.toString();
    }
  });
  return failedData;
};

// import { PalletMsaAddProvider } from "@polkadot/types/lookup";
// import {u8, u64} from "@polkadot/types-codec";

/**
 * publishes a single announcement on chain
 *
 * @param announcement
 * @param schemaId of related announcement
 * @param callback to run on success
 * @param errorCallback to run on error
 */
// export const publishAnnouncement = async (
//   announcement: unknown,
//   schemaId: number,
//   callback: DsnpCallback,
//   errorCallback: DsnpErrorCallback
// ): Promise<void> => {
//   const api = requireGetProviderApi();
//   const serviceKey = requireGetServiceKeys();
//   const publishExtrinsic = api.tx.announcements.publishAnnouncement(
//     schemaId,
//     announcement
//   );
//
//   publishExtrinsic
//     ?.signAndSend(serviceKey, ({ status, events }) => {
//       callback(status, events);
//     })
//     .catch((error: any) => {
//       errorCallback(error);
//     });
// };

/**
 * creates a new account using credentials key of a service account
 *
 * @param callback to run on success
 * @param errorCallback to run on error
 */
export const createAccountViaService = async (
  callback: DsnpCallback,
  errorCallback: DsnpErrorCallback
): Promise<void> => {
  const api = requireGetProviderApi();
  const serviceKey = requireGetServiceKeys();
  const signer = await requireGetSigner(); // this does the right thing, as documented
  const wallet = await requireGetWallet();
  const serviceMsaId = requireGetServiceMsaId();

  const currentBlock = (await api.query.system.number()).toBigInt();

  const data: DelegateData = {
    authorizedMsaId: serviceMsaId,
    schemaIds: Uint16Array.from([]),
    expiration: currentBlock + 100n,
  };

  const signRaw = signer?.signRaw;
  if (!signRaw) throw new Error("Error in signer");

  let walletAddress = wallet.getAddress();

  const typedDelegateData = api.registry.createType(
    "PalletMsaAddProvider",
    data
  );

  const result = await signRaw({
    address: walletAddress,
    data: typedDelegateData.toHex(),
    type: "bytes",
  } as SignerPayloadRaw);

  const extrinsic = api.tx.msa.createSponsoredAccountWithDelegation(
    walletAddress,
    {
      Sr25519: result.signature,
    },
    data
  );

  // https://substrate.stackexchange.com/questions/1776/how-to-use-polkadot-api-to-send-multiple-transactions-simultaneously
  extrinsic
    ?.signAndSend(serviceKey, { nonce: -1 }, ({ status, events }) => {
      const extrinsicFailedData = checkForFailedEvent(events);
      extrinsicFailedData === undefined
        ? callback(status, events)
        : errorCallback(Error(extrinsicFailedData));
    })
    .catch((error: any) => {
      errorCallback(error);
    });
};

export const createProviderMsa = async (
  callback: DsnpCallback,
  errorCallback: DsnpErrorCallback
) => {
  const api = requireGetProviderApi();
  const serviceKeys: KeyringPair = requireGetServiceKeys();

  // instantiate the extrinsic object
  const createMsaExtrinsic = api.tx.msa.create();
  await createMsaExtrinsic
    ?.signAndSend(serviceKeys, { nonce: -1 }, ({ status, events }) => {
      const extrinsicFailedData = checkForFailedEvent(events);
      extrinsicFailedData === undefined
        ? callback(status, events)
        : errorCallback(Error(extrinsicFailedData));
    })
    .catch((error: any) => {
      errorCallback(error);
    });
};

export const registerProvider = async (
  callback: DsnpCallback,
  errorCallback: DsnpErrorCallback
) => {
  const api = requireGetProviderApi();
  const serviceKeys = requireGetServiceKeys();

  const createProviderExtrinsic = api.tx.msa.createProvider("ExClPr");

  await createProviderExtrinsic
    ?.signAndSend(serviceKeys, { nonce: -1 }, ({ status, events }) => {
      const extrinsicFailedData = checkForFailedEvent(events);
      console.log({ extrinsicFailedData });
      extrinsicFailedData === undefined
        ? callback(status, events)
        : errorCallback(Error(extrinsicFailedData));
    })
    .catch((error: any) => {
      errorCallback(error);
    });
};

export const fetchAllSchemas = async (): Promise<Array<SchemaDetails>> => {
  const api = requireGetProviderApi();

  const schemasMax: bigint = (
    await await api.query.schemas.currentSchemaIdentifierMaximum()
  ).toBigInt();

  let returnList: Array<SchemaDetails> = [];
  for (let i = 1; i <= schemasMax; i++) {
    try {
      let s = await fetchSchema(i);
      returnList.push(s);
    } catch (e) {
      console.log("Error when fetching schemas: {}", e);
      continue;
    }
  }
  return returnList;
};

export const fetchSchema = async (schemaId: number): Promise<SchemaDetails> => {
  const api = requireGetProviderApi();

  const schema = await api.rpc.schemas.getBySchemaId(schemaId);
  let schemaResult = schema.unwrap();
  const jsonSchema = Buffer.from(schemaResult.model).toString("utf8");
  const modelParsed = JSON.parse(jsonSchema);
  const { schema_id, model_type, payload_location } = schemaResult;
  return {
    key: schema_id.toString(),
    schema_id: schema_id.toString(),
    model_type: model_type.toString(),
    payload_location: payload_location.toString(),
    model_structure: modelParsed,
  };
};

export const fetchMessagesForSchema = async (
  schema_id: number
): Promise<MessageResponse[]> => {
  const api = requireGetProviderApi();
  const messages: BlockPaginationResponseMessage =
    await api.rpc.messages.getBySchemaId(schema_id, {
      from_block: 0,
      from_index: 0,
      to_block: 50_000,
      page_size: 100,
    });
  const { content } = messages;
  return content;
};

export const createSchema = async (input: string) => {
  const api = requireGetProviderApi();
  const serviceKeys: KeyringPair = requireGetServiceKeys();

  const extrinsic = api.tx.schemas.createSchema(input, "AvroBinary", "OnChain");
  await extrinsic?.signAndSend(serviceKeys, { nonce: -1 });
};

export const createMessage = async (
  message: any,
  schema_id: number,
  success: DsnpCallback,
  error: DsnpErrorCallback
) => {
  const api = requireGetProviderApi();
  const serviceKeys: KeyringPair = requireGetServiceKeys();

  const messageHex = "0x" + message.toString("hex");
  console.log("'createMessage' message hex", messageHex);

  const extrinsic = api.tx.messages.addOnchainMessage(
    null,
    schema_id,
    messageHex
  );
  await extrinsic?.signAndSend(
    serviceKeys,
    { nonce: -1 },
    ({ status, events }) => {
      const extrinsicFailedData = checkForFailedEvent(events);
      extrinsicFailedData === undefined
        ? success(status, events)
        : error(Error(extrinsicFailedData));
    }
  );
};
