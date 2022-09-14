import { MessageResponse } from "@dsnp/frequency-api-augment/interfaces";
import { Json } from "@polkadot/types";
import avsc from 'avsc';
import { Button, Table } from "antd";
import Column from "antd/lib/table/Column";
import React from "react";
import { fetchAllMessages } from "../services/chain/apis/extrinsic";
import { MessageDetails } from "../services/types";
import { staticSchema } from "./RegisterSchema";

const ListMessages = (): JSX.Element => {

    const [listOfMessages, setListOfMessage] = React.useState<MessageDetails[]>([]);

    const listMessages = async () => {
        const s = 1;
        const messages = await fetchAllMessages(s);
        // setListOfMessage(messages);
        console.log("message payload: ", messages[0].payload);
        const payloadBuffer: Buffer = Buffer.from(messages[0].payload);
        console.log("payload buffer", payloadBuffer);
        const message = staticSchema.fromBuffer(payloadBuffer);
        if (!message) {console.log("message not deserialized!")}
        console.log("deserialized message: ", message);
    }

    return ( <>
        <Button onClick={listMessages}>List Messages</Button>
        <Table dataSource={listOfMessages}>
            <Column
                title="Message"
                dataIndex="payload"
                key="payload"
                render={(msg: JSON) => (
                    <pre>
                        {JSON.stringify({msg}, null, 2)}
                    </pre>
                )} />
            <Column title="Message length" dataIndex="payload_length" key="payload_length" />
        </Table>
        </>
    )
}

export default ListMessages;