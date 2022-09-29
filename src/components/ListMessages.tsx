import { MessageResponse } from "@frequency-chain/api-augment/interfaces";
import { Button, Space, Table } from "antd";
import Column from "antd/lib/table/Column";
import React from "react";
import { fetchMessagesForSchema } from "../services/chain/apis/extrinsic";
import { MessageDetails, SchemaDetails } from "../services/types";
import { staticSchema } from "./RegisterSchema";

interface ListMessageProps {
    schema: SchemaDetails;
}

const ListMessages = (props: ListMessageProps): JSX.Element => {

    const [listOfMessages, setListOfMessage] = React.useState<MessageDetails[]>([]);

    const listMessages = async () => {
        const messages: MessageResponse[] = await fetchMessagesForSchema(parseInt(props.schema.schema_id));

        let allMessages: MessageDetails[] = messages.map((msg, index) => {
            return {
                key: index,
                payload: staticSchema.fromBuffer(Buffer.from(msg.payload.buffer)),
                payload_length: msg.payload_length.toString()};
            });

            setListOfMessage(allMessages);
    }


        return ( <>
        <Space direction="vertical">
            <Button onClick={listMessages}>Refresh Messages</Button>
            <Table dataSource={listOfMessages} size="small" >
                <Column
                    title="Messages"
                    dataIndex="payload"
                    key="payload"
                    render={(msg: JSON) => (
                        <pre>
                            {JSON.stringify({msg}, null, 2)}
                        </pre>
                    )} />
                <Column
                    title="Message Length"
                    dataIndex="payload_length"
                    key="payload_length" />
            </Table>
            </Space>
            </>
        )
}

export default ListMessages;