// Import
// https://polkadot.js.org/docs/api/FAQ/#since-upgrading-to-the-7x-series-typescript-augmentation-is-missing
import "@polkadot/api-augment";
import {ApiPromise, WsProvider} from "@polkadot/api";
// import  * as AugmentedLocalApis from "./interfaces"
import {rpc, types} from "@dsnp/mrc-rpc";
import {Config} from "../config";

const DefaultWsProvider = new WsProvider(process.env.REACT_APP_CHAIN_HOST);

export const setupProviderApi = async (config: Config, providerHost: string = ''): Promise<ApiPromise> => {
    console.log("setupProviderApi")
    if (config.providerApi) {
        return config.providerApi;
    }
    const wsProvider =
        providerHost !== "" ? new WsProvider(providerHost) : DefaultWsProvider;
    config.providerApi = await ApiPromise.create({
        provider: wsProvider,
        types,
        rpc,
    });
    console.log({rpc})
    return config.providerApi;
};
