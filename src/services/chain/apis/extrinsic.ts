import {
  requireGetProviderApi,
  requireGetServiceKeys, requireGetServiceMsaId,
  requireGetSigner,
  requireGetWallet,
} from "../../config";
import {
  DsnpCallback,
  scaleEncode,
  DsnpErrorCallback, DelegateData,
} from "./common";
import { SignerPayloadRaw } from "@polkadot/types/types";
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

  const addProviderPayload: DelegateData = {
    authorizedMsaId: serviceMsaId,
    permission: 0,
  };
  const encodedPayload = scaleEncode(addProviderPayload);
  console.log({encodedPayload});

  const signRawCall = signer?.signRaw;
  if (!signRawCall) throw new Error("Error in signer");

  let delegatorKey = wallet.getAddress();

  console.log("about to call SignRawCall");
  const result = await signRawCall({
    address: wallet.getAddress(),
    data: encodedPayload,
    type: "bytes",
  } as SignerPayloadRaw);

  let proof = result.signature;
  console.log("proof", proof)
  const extrinsic = api.tx.msa.createSponsoredAccountWithDelegation(
    delegatorKey,
    proof,
    addProviderPayload
  );

  extrinsic
    ?.signAndSend(serviceKey, ({ status, events }) => {
      callback(status, events);
    })
    .catch((error: any) => {
      errorCallback(error);
    });
};

export const createMsaForProvider = (  callback: DsnpCallback,
                                       errorCallback: DsnpErrorCallback
) => {
  const api = requireGetProviderApi();
  const serviceKeys: KeyringPair = requireGetServiceKeys();
  const extrinsic = api.tx.msa.create();
  extrinsic
      ?.signAndSend(serviceKeys, ({ status, events }) => {
      callback(status, events);
  })
  .catch((error: any) => {
    errorCallback(error);
  });
}