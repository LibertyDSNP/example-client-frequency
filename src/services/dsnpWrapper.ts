import { setupProviderApi } from "./chain";
import {Config, setConfig, getConfig, updateConfig, requireGetProviderApi} from "./config";
import {Wallet, wallet, WalletType} from "./wallets/wallet";
import { buildServiceAccount } from "./chain/buildServiceAccount";
import { createMsaForProvider } from "./chain/apis/extrinsic";
import {Option, U32} from "@polkadot/types-codec"
const { decodeAddress, encodeAddress } = require('@polkadot/keyring');
const { hexToU8a, isHex } = require('@polkadot/util');

/**
 * setupChainAndServiceProviders initializes the DSNP sdk with a chain provider and
 * gets or creates an MSA ID for the configured service provider.
 * https://github.com/Liberty30/sdk-ts-dot/issues/3
 */
export const setupChainAndServiceProviders = async (walletType: WalletType): Promise<bigint> => {
    let curConfig: Config = await getConfig();

    const providerHost = String(
        process.env.REACT_APP_CHAIN_HOST ||
        "wss://polkadot-node-1.liberti.social"
    );
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

    let maybeServiceMsaId: Option<U32> = await (providerApi.rpc as any).msa.getMsaId(serviceKeys.publicKey);
    if (maybeServiceMsaId.isEmpty) {
        createMsaForProvider(
            async ()  => {
                maybeServiceMsaId = await (providerApi.rpc as any).msa.getMsaId(serviceKeys.publicKey);
            },
            (error) => {
                alert("Could not create MSA " + error.message);
            }
        )
    }

    let serviceMsaId: bigint = maybeServiceMsaId.value.toBigInt();
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
    let maybeServiceMsaId: Option<U32> = await (providerApi.rpc as any).msa.getMsaId(walletAddress);
    if (maybeServiceMsaId.isEmpty) { return undefined }
    let res = maybeServiceMsaId.value.toBigInt();
    console.log("msa ID: ", res);
    return res
}
