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

export const fetchAllActiveSchema = async () => {
    const api = requireGetProviderApi();
    const serviceKeys: KeyringPair = requireGetServiceKeys();

    const extrinsic = api.tx.schemas.get_schema();
    await extrinsic
        ?.signAndSend(serviceKeys, {nonce: -1});

};

export const registerSchema = async () => {
    const api = requireGetProviderApi();
    const serviceKeys: KeyringPair = requireGetServiceKeys();
    // instantiate the extrinsic object
    const extrinsic = api.tx.schemas.registerSchema();

    await extrinsic?.signAndSend(serviceKeys, {nonce: -1})

};
