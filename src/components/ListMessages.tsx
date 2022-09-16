import { MessageResponse } from "@dsnp/frequency-api-augment/interfaces";
import { Button, Col, Table } from "antd";
import Column from "antd/lib/table/Column";
import React from "react";
import { fetchMessagesForSchema } from "../services/chain/apis/extrinsic";
import { MessageDetails, SchemaProps } from "../services/types";
import { staticSchema } from "./RegisterSchema";

const ListMessages = (props: SchemaProps): JSX.Element => {

    const [listOfMessages, setListOfMessage] = React.useState<MessageDetails[]>([]);

    const listMessages = async () => {
        const messages: MessageResponse[] = await fetchMessagesForSchema(parseInt(props.schema.schema_id));

        let allMessages: MessageDetails[] = messages.map((msg) => {
            return {
                key: msg.block_number.toString(),
                payload: staticSchema.fromBuffer(Buffer.from(msg.payload.buffer)),
                payload_length: msg.payload_length.toString()};
            });

            setListOfMessage(allMessages);
    }

    if (props.isVisible)
        {return ( <>
            <Button onClick={listMessages}>Refresh List</Button>
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
            </>
        )}
    else return <></>
}

export default ListMessages;