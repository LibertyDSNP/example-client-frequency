import "@polkadot/api-augment";
import { TypeRegistry } from "@polkadot/types";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import { SingleAccountSigner } from "./singleAccountSigner";
import { Signer } from "@polkadot/api/types";
import { Keyring } from "@polkadot/api";

const keyType = "ed25519";
const testKeyring = new Keyring({ type: keyType });
const registry = new TypeRegistry();
const mnemonic = mnemonicGenerate();

export const createSignerWithName = (name: string): Signer => {
  const newPair = testKeyring.addFromUri(mnemonic, { name: name }, keyType);
  const newEd = testKeyring.addPair(newPair);
  return new SingleAccountSigner(registry, newEd);
};
