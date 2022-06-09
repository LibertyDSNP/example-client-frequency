import React, {useState} from "react";
import {Button, List} from "antd";
import * as wallet from "../services/wallets/wallet";

const {ApiPromise, WsProvider} = require('@polkadot/api');
// import {Button, Popover, Spin} from "antd";
// import {Registration} from "../services/dsnp";


const ConnectWallet = (): JSX.Element => {
    const [chain, setChain] = useState(null);
    const [nodeName, setNodeName] = useState("");
    const [nodeVersion, setNodeVersion] = useState("");
    const [walletAccounts, setWalletAccounts] = React.useState<wallet.AccountDetails[]>(
        []
    );
    const doConnectWallet = async () => {
        let w = wallet.wallet(wallet.WalletType.DOTJS);
        const availableAccounts = await w.availableAccounts();
        setWalletAccounts(availableAccounts);
    }

    const connectWallet = () => {
        (async () => doConnectWallet())();
    }

    return <div>
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
                <Button>Connected!</Button>
            </List>
        }
        {!walletAccounts.length &&
            <Button onClick={connectWallet}>Connect Wallet</Button>}
    </div>
}
export default ConnectWallet;
