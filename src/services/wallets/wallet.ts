import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { createInjector } from "../chain/test/extension";
import { Signer } from "@polkadot/api/types";
import { dotWallet } from "./dotWallet";

// HOW TO ADD A WALLET
// Add the new wallet to the enum and switch/case
// Both places are marked with a comment
// Then, create a Folder for the new wallet with it's implementation
// code. create an index.ts file in the folder that implements
// the Wallet interface below. Look at metamask for
// an example.

export enum WalletType {
  NONE = "NONE",
  DOTJS = "DOTJS",
}

export interface AccountDetails {
  address: string;
  type: WalletType;
  name?: string;
}

export const wallet = (walletType: WalletType): Wallet => {
  if (walletType === WalletType.DOTJS) return dotWallet;
  return noWallet;
};

export interface Wallet {
  icon: () => string;
  login: (address: string | undefined) => Promise<void>;
  logout: () => void;
  getAccount: () => InjectedAccountWithMeta | undefined;
  getAddress: () => string;
  getSigner: () => Promise<Signer | undefined>;
  availableAccounts: () => Promise<AccountDetails[]>;
}

export const noWallet: Wallet = {
  icon: () => "",
  login: async (_address: string | undefined) => new Promise(createInjector),
  logout: () => {
    return;
  },
  getAccount: () => undefined,
  getAddress: () => "0x0",
  getSigner: async () => Promise.resolve(undefined),
  availableAccounts: async () => [],
};
