import {
  InjectedExtensionInfo,
  Injected,
  InjectedExtension,
  InjectedAccount,
} from "@polkadot/extension-inject/types";
import { createSignerWithName } from "./accounts";

export type TestExtension = InjectedExtensionInfo & Injected;
type Unsubcall = () => void;

class TestInjectedAccounts {
  public unsubWasCalled = false;
  public accounts: Array<InjectedAccount> = [];

  private unsub() {
    this.unsubWasCalled = true;
    return;
  }

  public async get(_anyType?: boolean): Promise<InjectedAccount[]> {
    return Promise.resolve(this.accounts);
  }

  public subscribe(
    _cb: (accounts: InjectedAccount[]) => void | Promise<void>
  ): Unsubcall {
    return this.unsub;
  }
}

// export type TestInjectedProvider = Injected;

export const createInjector = async (): Promise<InjectedExtension> => {
  const ext: TestExtension = {
    name: "testExtension",
    version: "v0",
    accounts: new TestInjectedAccounts(),
    signer: createSignerWithName("alicia"),
  };
  return ext;
};
