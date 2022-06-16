import { setupProviderApi } from "./chain";
import {Config, setConfig, getConfig, updateConfig} from "./config";
import { wallet, WalletType } from "./wallets/wallet";
import { buildServiceAccount } from "./chain/buildServiceAccount";
import { createMsaForProvider } from "./chain/apis/extrinsic";
import {Option, U32} from "@polkadot/types-codec"

/**
 * setupProvider initializes the DSNP sdk with a chain provider.
 * https://github.com/Liberty30/sdk-ts-dot/issues/3
 */
export const setupProvider = async (walletType: WalletType): Promise<void> => {
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
    console.log("maybeServiceMsaId: ",  maybeServiceMsaId.value.toString());

    let serviceMsaId: bigint = maybeServiceMsaId.value.toBigInt();
    conf.serviceMsaId = serviceMsaId;
    updateConfig(conf);
};
