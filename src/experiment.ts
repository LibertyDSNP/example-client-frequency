import {
    requireGetProviderApi,
    requireGetServiceKeys
} from "./services/config";
import {KeyringPair} from "@polkadot/keyring/types";

export const getConstant = async () => {
    const api = requireGetProviderApi();

    const lastHeader = await api.rpc.chain.getHeader();
    console.log("last header: {}", lastHeader);
    return lastHeader;

}

getConstant();