// Import
// https://polkadot.js.org/docs/api/FAQ/#since-upgrading-to-the-7x-series-typescript-augmentation-is-missing
import "@polkadot/api-augment";
import { ApiPromise, WsProvider } from "@polkadot/api";
import {AugmentedRpc} from "@polkadot/rpc-core/types";


interface Config {
  api?: ApiPromise;
}

const config: Config = {};

const DefaultWsProvider = new WsProvider(process.env.REACT_APP_CHAIN_HOST);

export const setupProviderApi = async (
  providerHost: string = ""
): Promise<ApiPromise> => {
  if (config.api) {
    return config.api;
  }
  const wsProvider =
    providerHost !== "" ? new WsProvider(providerHost) : DefaultWsProvider;

  // load all custom types and RPCs into api definition
  // const types = Object.values(apiQuery).reduce(
  //   (res, { types }): Record<string, unknown> => ({ ...res, ...types }),
  //   {}
  // );
  // const rpc = Object.values(AugmentedRpc).reduce(
  //   (res, { rpc }): Record<string, unknown> => ({ ...res, ...rpc }),
  //   {}
  // );

  config.api = await ApiPromise.create({
    provider: wsProvider,
    // types: {
    //   ...types,
    // },
    // rpc: {
    //   ...rpc,
    // },
  });
  console.log(config.api);
  return config.api;
};
