import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp";
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import { Signer } from "@polkadot/api/types";
import { AccountDetails, Wallet, WalletType } from "./wallet";

let EXTENSIONS: InjectedExtension[] = [];
let currentAccount: InjectedAccountWithMeta | undefined;

const login = async (): Promise<void> => {
  if (EXTENSIONS.length === 0) {
    const extensions = await web3Enable("example client");

    if (extensions.length === 0)
      throw new Error(
        "Make sure there is an extension installed and accept the authorization"
      );
    EXTENSIONS = extensions;
  }
};

export const dotWallet: Wallet = {
  icon: () => "https://https://polkadot.js.org/docs/img/logo.svg",

  login: async (address: string | undefined = undefined) => {
    await login();
    if (address) {
      const allAccounts = await web3Accounts();
      const index = allAccounts.findIndex((a) => a.address === address);
      if (index === -1)
        throw new Error(address + " does not exists in current wallet");
      currentAccount = allAccounts[index];
    }
  },

  logout: (): void => {
    EXTENSIONS = [];
    currentAccount = undefined;
  },

  getAccount: (): InjectedAccountWithMeta | undefined => currentAccount,

  getAddress: (): string => {
    return currentAccount?.address || "";
  },

  getSigner: async (): Promise<Signer | undefined> => {
    if (!currentAccount) return undefined;
    const injector = await web3FromSource(currentAccount.meta.source);
    return injector.signer;
  },

  availableAccounts: async (): Promise<AccountDetails[]> => {
    await login();
    const allAccounts = await web3Accounts();
    return allAccounts.map((a) => ({
      address: a.address,
      type: WalletType.DOTJS,
      name: a.meta.name,
    }));
  },
};
