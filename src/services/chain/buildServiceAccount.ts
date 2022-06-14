import { Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { Config } from "../config";

/**
 * buildServiceAccount returns the REACT_APP_SERVICE_SECRET_SEED
 * @returns the Keypair for service
 */
export const buildServiceAccount = (curConfig: Config): KeyringPair => {
    if (curConfig?.serviceKeys) return curConfig.serviceKeys;
    console.log("buildServiceAccount");
    const keyring = new Keyring();
    if (process.env.REACT_APP_SERVICE_SECRET_SEED) {
        console.log("buildServiceAccount has secret seed")
        return keyring.addFromUri(
            process.env.REACT_APP_SERVICE_SECRET_SEED,
            undefined,
            "sr25519"
        );
    }
    return keyring.addFromUri("//Alice", { name: "Alice default" }, "sr25519");
};

