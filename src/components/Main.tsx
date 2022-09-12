import React, {useEffect, useState} from "react";
import {Button, Layout, List, Typography} from "antd";
import * as wallet from "../services/wallets/wallet";
import {getMsaId, setupChainAndServiceProviders} from "../services/dsnpWrapper";
import {createAccountViaService, addMessage, fetchAllMessages } from "../services/chain/apis/extrinsic";
import { MessageResponse } from "@dsnp/frequency-api-augment/interfaces";
import RegisterSchema, { staticSchema } from "./RegisterSchema";
import ListSchemas from "./ListSchemas";


const {Header, Content, Footer} = Layout;
const {Text, Title} = Typography;


const Main = (): JSX.Element => {
    const [walletAccounts, setWalletAccounts] = React.useState<wallet.AccountDetails[]>(
        []
    );
    const [msaId, setMsaId] = React.useState<bigint>(0n);
    const [serviceMsaId, setServiceMsaId] = React.useState<bigint>(0n);
    const [walletAddress, setWalletAddress] = React.useState<string>("");

    const [connectionLabel, setConnectionLabel] = useState<string>(
        "connecting..."
    );

    const [chainConnectionClass, setChainConnectionClass] = useState<string>(
        "Footer--chainConnectionState"
    )

    const [inputJsonMessage, setInputJsonMessage] = React.useState<string>();
    const [inputSchmema, setInputSchmema] = React.useState<string>();
    const [listOfMessages, setListOfMessage] = React.useState<Array<MessageResponse>>([]);

    const walletType = wallet.WalletType.DOTJS
    const doConnectWallet = async () => {
        const w = wallet.wallet(walletType);
        const availableAccounts = await w.availableAccounts();
        setWalletAccounts(availableAccounts);
    }

    const connectWallet = () => {
        (async () => doConnectWallet())();
    }

    const getAndSetMsaId = async() => {
        let msa_id = await getMsaId(wallet.wallet(walletType));
        if (msa_id !== undefined) setMsaId(msa_id);
    }

    const doLogin = async (addr: string) => {
        await wallet.wallet(walletType).login(addr);
        await getAndSetMsaId();
    }

    const login = (addr: string) => {
        (async () => doLogin(addr))();

        setWalletAddress(addr);
    }

    const doLogout = async () => {
        await wallet.wallet(walletType).logout();
    }
    const logout = () => {
        (async () => doLogout())();
        setMsaId(0n);
        setWalletAddress("");
    }

    const registerMsa = () => {
        (async () => {
            try {
                createAccountViaService(
                    async () => {
                        await getAndSetMsaId();
                    },
                    () => {
                        console.error("fail")
                    }
                )
            } catch (e) {
                console.error(e);
            }
        })();
    }

    const validateJsonExample = async () => {

        const valid = staticSchema.isValid({ nickname:'omar',favorite_number: 6,favorite_restaurant:'Ramen Takeya'});
        console.log("is valid? ", valid);
    }

    const validateJson = async () => {
        console.log("you have validated json", inputJsonMessage);
    }

    const updateJsonMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputJsonMessage(event.target.value);
    }

    const updateSchemaInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputSchmema(event.target.value);
    }

    const submitMessage =  async () => {
        let input =
        {
            "nickname": "omar", "favorite_number": 6, "favorite_restaurant": "Ramen Takeya"
        }
        let message: Buffer = staticSchema.toBuffer({nickname: "omar", favorite_number: 6, favorite_restaurant: "Ramen Takeya"})
        addMessage(message, 1);
        console.log("submit message func finished?");
    }

    const listMessages = async () => {
        const s = 1;
        const messages: MessageResponse[] = await fetchAllMessages(s);
        setListOfMessage(messages);
        console.log(messages[0].payload.buffer);
    }

    useEffect(() => {
        (async () => {
            try {
                let serviceMsaId = await setupChainAndServiceProviders(walletType);
                setServiceMsaId(serviceMsaId);
                setConnectionLabel("Chain connected");
                setChainConnectionClass("Footer--chainConnectionState connected");

            } catch (e: any) {
                console.error(e);
            }
        })();
    });

    return <Layout className="App">
        <Header>
            <Title level={2} className="Header--title">Polkadot.js + Frequency</Title>
        </Header>
        <Content className="Content">
            {walletAccounts.length > 0 &&
                <List
                    dataSource={walletAccounts}
                    renderItem={(acct: wallet.AccountDetails) => (
                        <List.Item>
                            <List.Item.Meta
                                title={acct.name}
                            />
                            {walletAddress === acct.address &&
                                <div className="WalletList--walletRow">
                                    <Text>Logged in as </Text>
                                    {msaId !== 0n &&
                                        <Text>MSA Id: {msaId.toString()} </Text>
                                    }
                                    <Text strong className="Main--addressList--walletAddress">Address: {acct.address} </Text>
                                    <Button type="primary" onClick={() => logout()}>logout</Button>
                                </div>
                            }
                            {walletAddress === "" &&
                                <div>
                                    <Text>Address: </Text>
                                    <Text strong className="Main--addressList--walletAddress">{acct.address}</Text>
                                    <Button type="primary" onClick={() => login(acct.address)}>Login with this
                                        account</Button>
                                </div>
                            }
                        </List.Item>
                    )}
                >
                </List>
            }
            {walletAccounts.length === 0 &&
                <Title level={3}>Wallet is not connected yet.</Title>
            }
            {walletAddress !== "" && msaId === 0n &&
                <Button onClick={registerMsa}>Register MSA</Button>
            }
        </Content>
        <Content>
            {
                <RegisterSchema />
            }
            {
                <ListSchemas />
            }
            {
                <Button onClick={submitMessage}>Submit Message</Button>
            }
        </Content>
        <Footer className="Footer">
            {!walletAccounts.length &&
                <Button onClick={connectWallet}>Connect Wallet</Button>}
            {walletAccounts.length > 0 && <Text className="walletConnectionState--connected">Wallet connected</Text>}
            {serviceMsaId !== 0n &&
                <Text className={chainConnectionClass}>{"Service MSA ID: " + serviceMsaId.toString()}</Text>
            }
            <Text className={chainConnectionClass}>{connectionLabel}</Text>
        </Footer>
    </Layout>
}
export default Main;
