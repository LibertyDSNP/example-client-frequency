// Import
import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "@frequency-chain/api-augment";
import { Config } from "../config";

const DefaultWsProvider = new WsProvider(process.env.REACT_APP_CHAIN_HOST);

export const setupProviderApi = async (
  config: Config,
  providerHost: string = ""
) => {
  if (config.providerApi) {
    return config.providerApi;
  }
  const wsProvider =
    providerHost !== "" ? new WsProvider(providerHost) : DefaultWsProvider;
  config.providerApi = await ApiPromise.create({
    provider: wsProvider,
    ...options,
  });
  return config.providerApi;
};
