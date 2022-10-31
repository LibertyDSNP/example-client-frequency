import { setupProviderApi } from "./chain";
import {
  Config,
  setConfig,
  getConfig,
  updateConfig,
  requireGetProviderApi,
} from "./config";
import { Wallet, wallet, WalletType } from "./wallets/wallet";
import { buildServiceAccount } from "./chain/buildServiceAccount";
import { createProviderMsa, registerProvider } from "./chain/apis/extrinsic";
import { Option, U64 } from "@polkadot/types-codec";

/**
 * setupChainAndServiceProviders initializes the DSNP sdk with a chain provider and
 * gets or creates an MSA ID for the configured service provider.
 * https://github.com/Liberty30/sdk-ts-dot/issues/3
 */
export const setupChainAndServiceProviders = async (
  walletType: WalletType
): Promise<bigint> => {
  let curConfig: Config = await getConfig();

  const providerHost = String(process.env.REACT_APP_CHAIN_HOST);
  const providerApi = await setupProviderApi(curConfig, providerHost);
  const w = wallet(walletType);
  const serviceKeys = buildServiceAccount(curConfig);
  const conf: Config = {
    ...curConfig,
    wallet: w,
    serviceKeys,
    providerApi,
  };
  setConfig(conf);

  // querying this rpc endpoint responds with a PolkadotJS version of rust's Option
  let maybeServiceMsaId: Option<U64> =
    (await providerApi.query.msa.publicKeyToMsaId(
      serviceKeys.publicKey
    )) as Option<U64>;
  if (maybeServiceMsaId.isEmpty) {
    // maybe it just hasn't been created yet.  attempt to create, then fetch the result.
    await createProviderMsa(
      async (status, events) => {
        maybeServiceMsaId = (await providerApi.query.msa.publicKeyToMsaId(
          serviceKeys.publicKey
        )) as Option<U64>;
        if (maybeServiceMsaId.isEmpty) {
          alert("Could not fetch service provider MSA");
        } else {
          // once the MSA has been created, it must be "registered" by calling the createProvider extrinsic
          // before anyone can delegate to it.
          await registerProvider(
            async (status, events) => {},
            (error) => {
              alert("Could not register Provider: " + error.message);
            }
          );
        }
      },
      (error) => {
        alert("Could not create MSA " + error.message);
      }
    );
  }

  let serviceMsaId: bigint = BigInt(maybeServiceMsaId.value.toString());

  // check for service provider registration
  const maybeProviderRegistryEntry =
    await providerApi.query.msa.providerToRegistryEntry(serviceMsaId);
  if (maybeProviderRegistryEntry.isEmpty) {
    await registerProvider(
      async (status, events) => {},
      (error) => {
        alert("Could not register Provider: " + error.message);
      }
    );
  }

  conf.serviceMsaId = serviceMsaId;
  updateConfig(conf);
  return serviceMsaId;
};

/**
 * getMsaIdResult queries the chain for a matching MSA Id and returns the MSA ID if it exists, or undefined if not.
 */
export const getMsaId = async (wallet: Wallet): Promise<bigint | undefined> => {
  let providerApi = requireGetProviderApi();
  let walletAddress = wallet.getAddress();
  let maybeMsaId: Option<U64> = (await providerApi.query.msa.publicKeyToMsaId(
    walletAddress
  )) as Option<U64>;
  if (maybeMsaId.isEmpty) {
    console.log("still no msaID");
    return undefined;
  }
  let msaId = maybeMsaId.value.toBigInt();
  console.log("msa ID: ", msaId);
  return msaId;
};
