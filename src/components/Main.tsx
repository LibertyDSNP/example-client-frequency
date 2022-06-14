import React, {useState, useEffect} from "react";
import {Button, List, Typography} from "antd";
import * as wallet from "../services/wallets/wallet";
import { setupProvider } from "../services/dsnpWrapper";
import {createAccountViaService} from "../services/chain/apis/extrinsic";

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
    const [walletAddress, setWalletAddress] = React.useState<string>("");

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
        setWalletAddress(addr);
    }

    const registerMsa = () => {
        (async () => {
            try {
                createAccountViaService(
                    () => { console.log("success")},
                    () => { console.error("fail")}
                )
            } catch (e) {
                console.error(e);
            }
        })();
    }

    useEffect(() => {
        (async () => {
            try {
                await setupProvider(walletType);
                setConnectionLabel("Chain connected");
            } catch (e: any) {
                console.error(e);
            }
        })();
    });

    return <div>
        {walletAccounts.length > 0 &&
            <List
                dataSource={walletAccounts}
                renderItem={ (acct: wallet.AccountDetails) => (
                    <List.Item>
                        <List.Item.Meta
                            title={acct.name}
                        />
                        {walletAddress === acct.address &&
                            <Typography.Text>Logged in as&nbsp;</Typography.Text>
                        }
                        <Typography.Text>Address: {acct.address}</Typography.Text>
                        {walletAddress === "" &&
                            <Button onClick={() => login(acct.address) }>Login with this address</Button>
                        }
                    </List.Item>
                    )}
            >
            </List>
        }
        {walletAddress !== "" &&
            <Button onClick={registerMsa}>Register MSA</Button>
        }
        {!walletAccounts.length &&
            <Button onClick={connectWallet}>Connect Wallet</Button>}
        <p>{connectionLabel}</p>
    </div>
}
export default Main;
