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
            ({status, events,}) => {
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

    const schema_id = 10;
    // const schemaId = api.rpc.schemas.getLatestSchemaId("None")
    // console.log(schemaId.toString());

    let returnList: Array<any> = [];
    for (let i = 1; i <= schema_id; i++) {
        try {
            const schema = await (await api.rpc.schemas.getBySchemaId(i));
            if (!schema.isEmpty) {
                let s = schema.unwrap();
                console.log("Schema ID %s, %s, Location: %s", s.schema_id, s.model_type, s.payload_location);
                returnList.concat(s.schema_id);
            }
        } catch(e) {
            console.log ("Error when fetching schemas: {}", e);
            continue;
        }
      }
    return returnList;
}

export const registerSchema = async (input: string) => {
    const api = requireGetProviderApi();
    const serviceKeys: KeyringPair = requireGetServiceKeys();

    const extrinsic =  api.tx.schemas.registerSchema(input, 'AvroBinary' , 'OnChain');
    await extrinsic?.signAndSend(serviceKeys, {nonce: -1});

};

export const addMessage = async (message: string, schema_id: number) => {
    const api = requireGetProviderApi();
    const serviceKeys: KeyringPair = requireGetServiceKeys();

    const extrinsic = api.tx.messages.addOnchainMessage(null, schema_id, message);
    await extrinsic?.signAndSend(serviceKeys, {nonce: -1});
}

export const getMessages = async (schema_id: number) => {
    const api = requireGetProviderApi();

    const messages = await api.rpc.messages.getBySchema(schema_id, {from_block: 0, from_index: 0, to_block: 50_000, page_size: 100});

    console.log("messages: {}", JSON.stringify(messages.content, null, ' '));

}