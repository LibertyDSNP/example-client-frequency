import React, {useState, useEffect} from "react";
import {Button, List} from "antd";
import * as wallet from "../services/wallets/wallet";
import { updateConfig } from "../services/config";
import { setupProviderApi} from "../services/chain";

const {ApiPromise, WsProvider} = require('@polkadot/api');
// import {Button, Popover, Spin} from "antd";
// import {Registration} from "../services/dsnp";


const Main = (): JSX.Element => {
    const [chain, setChain] = useState(null);
    const [nodeName, setNodeName] = useState("");
    const [nodeVersion, setNodeVersion] = useState("");
    const [walletAccounts, setWalletAccounts] = React.useState<wallet.AccountDetails[]>(
        []
    );
    const [connectionLabel, setConnectionLabel] = useState<string>(
        "connecting..."
    );

    const walletType = wallet.WalletType.DOTJS
    const doConnectWallet = async () => {
        const w = wallet.wallet(walletType);
        const availableAccounts = await w.availableAccounts();
        setWalletAccounts(availableAccounts);
    }

    const connectWallet = () => {
        (async () => doConnectWallet())();
    }

    const doLogin = async(addr: string) => {
        await wallet.wallet(walletType).login(addr);
    }

    const login = (addr: string) => {
        (async () => doLogin(addr))();
    }

    useEffect(() => {
        (async () => {
            try {
                const providerHost = String(
                    process.env.REACT_APP_CHAIN_HOST ||
                    "wss://polkadot-node-1.liberti.social"
                );
                const api = await setupProviderApi(providerHost);
                updateConfig({ providerApi: api });
                setConnectionLabel("Connected to " + providerHost + " chain");
            } catch (e: any) {
                console.error(e);
            }
        })();
    });

    return <div>
        <h3>{connectionLabel}</h3>
        {walletAccounts.length > 0 &&
            <List
                dataSource={walletAccounts}
                renderItem={ (acct: wallet.AccountDetails) => (
                    <List.Item>
                        <List.Item.Meta
                            title={acct.name}
                        />
                        <p>Address: {acct.address}</p>
                    </List.Item>
                    )}
            >
            </List>
        }
        {!walletAccounts.length &&
            <Button onClick={connectWallet}>Connect Wallet</Button>}
    </div>
}
export default Main;
