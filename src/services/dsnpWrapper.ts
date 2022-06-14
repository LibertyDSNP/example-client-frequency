import { setupProviderApi } from "./chain";
import { Config, setConfig,getConfig } from "./config";
import { wallet, WalletType } from "./wallets/wallet";
import { buildServiceAccount } from "./chain/buildServiceAccount";
import { createMsaForProvider } from "./chain/apis/extrinsic";

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

    console.log({rpcmsa: (providerApi.rpc as any).msa})
    let serviceMsaId = await (providerApi.rpc as any).msa.getMsaId(serviceKeys.publicKey);
    if (!serviceMsaId) {
        createMsaForProvider(
            ()  => {
                console.log("createdMSA");
            },
            () => console.error("failed to create MSA")
        )
    }
    const conf: Config = {
        ...curConfig,
        wallet: w,
        serviceKeys,
        providerApi,
        serviceMsaId,
    };

    setConfig(conf);
};
