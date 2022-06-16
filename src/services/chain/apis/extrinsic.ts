import {
    requireGetProviderApi,
    requireGetServiceKeys,
    requireGetServiceMsaId,
    requireGetSigner,
    requireGetWallet,
} from "../../config";
import {DelegateData, DsnpCallback, DsnpErrorCallback, scaleEncode,} from "./common";
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

    console.log({serviceMsaId});

    const addProviderPayload: DelegateData = {
        authorizedMsaId: serviceMsaId,
        permission: 0n,
    };
    const encodedPayload = scaleEncode(addProviderPayload);

    const signRawCall = signer?.signRaw;
    if (!signRawCall) throw new Error("Error in signer");

    let delegatorKey = wallet.getAddress();

    const result = await signRawCall({
        address: wallet.getAddress(),
        data: encodedPayload,
        type: "bytes",
    } as SignerPayloadRaw);

    let proof = {
        Sr25519: result.signature,
    };
    console.log(proof);
    const extrinsic = api.tx.msa.createSponsoredAccountWithDelegation(
        delegatorKey,
        proof,
        addProviderPayload
    );

    extrinsic
        ?.signAndSend(serviceKey, {nonce: -1},
            ({status, events, }) => {
            callback(status, events);
        })
        .catch((error: any) => {
            errorCallback(error);
        });
};

export const createMsaForProvider = (callback: DsnpCallback,
                                     errorCallback: DsnpErrorCallback
) => {
    const api = requireGetProviderApi();
    const serviceKeys: KeyringPair = requireGetServiceKeys();
    const extrinsic = api.tx.msa.create();
    extrinsic
        ?.signAndSend(serviceKeys, {nonce: -1},
            ({status, events}) => {
            callback(status, events);
        })
        .catch((error: any) => {
            errorCallback(error);
        });
}