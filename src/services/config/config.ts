import { ApiPromise } from "@polkadot/api";
import { Signer } from "@polkadot/api/types";

import {
  MissingFromIdConfigError,
  MissingProviderConfigError,
  MissingServiceKeyConfigError,
  MissingServiceMsaIdConfigError,
  MissingSignerConfigError,
  MissingWalletConfigError,
} from "./errors";
import { Wallet } from "../wallets/wallet";
import { KeyringPair } from "@polkadot/keyring/types";

/*
 * The Config Interface provides for various settings and plugable modules.
 */
export interface Config {
  // for interacting with extension
  wallet?: Wallet;
  // service keys
  serviceKeys?: KeyringPair;
  // service MSA ID
  serviceMsaId?: number;
  // for interacting with chain
  providerApi?: ApiPromise;
  // file store
  store?: unknown;
  // contains DSNP static ID we're signed in as
  currentFromURI?: string;
}

/**
 * ConfigOpts represents override options to be passed when fetching the config
 */
export type ConfigOpts = Partial<Config>;

let config: Config = {};

/**
 * getConfig() fetches the current configuration settings and returns them.
 *
 * @returns The current configuration settings with ConfigOpts as overrides.
 */
export const getConfig = (): Config => {
  return config;
};

/**
 * setConfig() sets the current configuration with the given object.
 *
 * @param newConfig - The configuration settings to set with
 */
export const setConfig = (newConfig: Config): void => {
  config = newConfig;
};

export const updateConfig = (newOpts: ConfigOpts): Config => {
  config = {
    ...config,
    ...newOpts,
  };
  return config;
};

/**
 * Get the provider and if undefined, throw.
 *
 * @throws {@link MissingProviderConfigError}
 * Thrown if the provider is not configured.
 * @param opts - overrides for the current configuration.
 * @returns a never-undefined provider
 */
export const requireGetProviderApi = (opts?: ConfigOpts): ApiPromise => {
  const provider = opts?.providerApi || getConfig().providerApi;
  if (!provider) throw new MissingProviderConfigError();
  return provider;
};
/**
 * Get the signer and if undefined, throw.
 *
 * @throws {@link MissingSignerConfigError}
 * Thrown if the signer is not configured.
 * @param opts - overrides for the current configuration.
 * @returns a never-undefined signer
 */
export const requireGetSigner = async (opts?: ConfigOpts): Promise<Signer> => {
  const wallet = opts?.wallet || getConfig().wallet;
  if (wallet === undefined) throw MissingProviderConfigError;
  const signer = await wallet.getSigner();
  if (!signer) throw new MissingSignerConfigError();
  return signer as Signer;
};

/**
 * Get the currentFromURI and if undefined, throw.
 *
 * @throws {@link MissingFromIdConfigError}
 * Thrown if the currentFromURI is not configured.
 * @param opts - overrides for the current configuration.
 * @returns a never-undefined currentFromURI
 */
export const requireGetCurrentFromURI = (opts?: ConfigOpts): string => {
  const currentFromURI = opts?.currentFromURI || getConfig().currentFromURI;
  if (!currentFromURI) throw new MissingFromIdConfigError();
  return currentFromURI;
};

/**
 * Get the wallet and if undefined, throw.
 *
 * @throws {@link MissingWalletConfigError}
 * Thrown if the provider is not configured.
 * @param opts - overrides for the current configuration.
 * @returns a never-undefined provider
 */
export const requireGetWallet = (opts?: ConfigOpts): Wallet => {
  const wallet = opts?.wallet || getConfig().wallet;
  if (!wallet) throw new MissingWalletConfigError();
  return wallet;
};

/**
 * Get the service key and if undefined, throw.
 *
 * @throws {@link MissingServiceKeyConfigError}
 * Thrown if the service key is not configured.
 * @param opts - overrides for the current configuration.
 * @returns a never-undefined provider
 */
export const requireGetServiceKeys = (opts?: ConfigOpts): KeyringPair => {
  const serviceKey = opts?.serviceKeys || getConfig().serviceKeys;
  if (!serviceKey) throw new MissingServiceKeyConfigError();
  return serviceKey;
};

/** Get the Service MSA Id and if undefined, throw.
 * @throw {@link MissingServiceMsaIdConfigError}
 * Thrown if the Service MSA Id is not configured.
 * @param opts - overrides for the current configuration
 * @returns a never-undefined MSA Id (number)
 */
export const requireGetServiceMsaId = (opts?: ConfigOpts): number => {
  const serviceMsaId = opts?.serviceMsaId || getConfig().serviceMsaId;
  if (!serviceMsaId) throw new MissingServiceMsaIdConfigError();
  return serviceMsaId;
}