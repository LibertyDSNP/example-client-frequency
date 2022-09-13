import {
    requireGetProviderApi,
    requireGetServiceKeys,
    requireGetServiceMsaId,
    requireGetSigner,
    requireGetWallet,
} from "../../config";
import {DelegateData, DsnpCallback, DsnpErrorCallback, scaleEncodeDelegateData,} from "./common";
import {SignerPayloadRaw} from "@polkadot/types/types";
import {KeyringPair} from "@polkadot/keyring/types";
import { BlockPaginationResponseMessage, MessageResponse } from "@dsnp/frequency-api-augment/interfaces";
import startCase from 'lodash/startCase';

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

    const data: DelegateData = {
        authorizedMsaId: serviceMsaId,
        permission: 0n,
    };

    const signRaw = signer?.signRaw;
    if (!signRaw) throw new Error("Error in signer");

    let walletAddress = wallet.getAddress();

    let encoded = scaleEncodeDelegateData(data);

    const result = await signRaw({
        address: walletAddress,
        data: encoded,
        type: "bytes",
    } as SignerPayloadRaw);

    const extrinsic = api.tx.msa.createSponsoredAccountWithDelegation(
        walletAddress,
        {
            Sr25519: result.signature,
        },
        data,
    );

    // nonce: -1 is needed in latest versions - see
    // https://substrate.stackexchange.com/questions/1776/how-to-use-polkadot-api-to-send-multiple-transactions-simultaneously
    extrinsic
        ?.signAndSend(serviceKey, {nonce: -1},
            ({status, events}) => {
                if (status.isInBlock) {
                    console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                } else {
                    console.log(`Current status: ${status.type}`);
                }
                callback(status, events);
            })
        .catch((error: any) => {
            errorCallback(error);
        });
};

export const createMsaForProvider = async (callback: DsnpCallback,
                                     errorCallback: DsnpErrorCallback
) => {
    const api = requireGetProviderApi();
    const serviceKeys: KeyringPair = requireGetServiceKeys();
    // instantiate the extrinsic object
    const extrinsic = api.tx.msa.create();
    await extrinsic
        ?.signAndSend(serviceKeys, {nonce: -1},
            ({status, events}) => {
            callback(status, events);
        })
        .catch((error: any) => {
            errorCallback(error);
        });
}

export const fetchAllSchemas = async (): Promise<Array<any>> => {
  const api = requireGetProviderApi();

  const schema_id = await api.rpc.schemas.getLatestSchemaId();

  let returnList: Array<string> = [];
  for (let i = 1; i <= schema_id; i++) {
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

export const fetchSchema = async (schemaId: number): Promise<any> => {
  const api = requireGetProviderApi();

  const schema = await api.rpc.schemas.getBySchemaId(schemaId);
  let schemaResult = schema.unwrap();
  const jsonSchema = Buffer.from(schemaResult.model).toString("utf8");
  const modelParsed = JSON.parse(jsonSchema);
  const { schema_id, model_type, payload_location } = schemaResult;
  return {
    key: schemaId.toString(),
    schema_id: schema_id.toString(),
    model_type: startCase(model_type.toString()).toString(),
    payload_location: startCase(payload_location.toString()).toString(),
    model_structure: JSON.stringify(modelParsed, null, 2) };
//   return { ...schemaResult, modelParsed: JSON.stringify(modelParsed, null, ' ') };
};

export const fetchAllMessages = async (schema_id: number): Promise<Array<MessageResponse>> => {
    const api = requireGetProviderApi();
    // const schema_id = await api.rpc.schemas.getLatestSchemaId();

    const messages: BlockPaginationResponseMessage = await api.rpc.messages.getBySchema(schema_id, {from_block: 0, from_index: 0, to_block: 50_000, page_size: 100});

    const { content } = messages
    return content;
}

export const registerSchema = async (input: string) => {
    const api = requireGetProviderApi();
    const serviceKeys: KeyringPair = requireGetServiceKeys();

    const extrinsic =  api.tx.schemas.registerSchema(input, 'AvroBinary' , 'OnChain');
    await extrinsic?.signAndSend(serviceKeys, {nonce: -1});

};

export const addMessage = async (message: Buffer, schema_id: number) => {
    const api = requireGetProviderApi();
    const serviceKeys: KeyringPair = requireGetServiceKeys();
    const extrinsic = api.tx.messages.addOnchainMessage(null, schema_id, message);
    await extrinsic?.signAndSend(serviceKeys, {nonce: -1});
};
