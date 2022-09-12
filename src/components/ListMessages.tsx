import { MessageResponse } from "@dsnp/frequency-api-augment/interfaces";
import { Button } from "antd";
import React from "react";
import { fetchAllMessages } from "../services/chain/apis/extrinsic";

const ListMessages = (): JSX.Element => {

    const [listOfMessages, setListOfMessage] = React.useState<Array<MessageResponse>>([]);

    const listMessages = async () => {
        const s = 1;
        const messages: MessageResponse[] = await fetchAllMessages(s);
        setListOfMessage(messages);
        console.log(messages[0].payload.buffer);
    }
    return <Button>this is a button</Button>
}

export default ListMessages;