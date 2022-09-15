import { Button, Table } from "antd";
import React, { useState } from "react";
import { fetchAllSchemas } from "../services/chain/apis/extrinsic";
import { SchemaDetails } from "../services/types";
import startCase from 'lodash';
import './styles.css';
import Column from "antd/lib/table/Column";
import CreateMessage from "./CreateMessage";
import ListMessages from "./ListMessages";

const ListSchemas = (): JSX.Element => {
    const [listOfSchemas, setListOfSchemas] = React.useState<SchemaDetails[]>([]);
    const [selectedSchema, setSelectedSchema] = useState<SchemaDetails>({key: 0, schema_id: "0", model_type: "", payload_location: "", model_structure: JSON.parse("{}")});
    const [showCreateMessageComp, setShowCreateMessageComp] = useState(false);
    const [showLlistMessageComp, setShowListMessageComp] = useState(false);

    const listSchemas = async () => {
        const schemas = await fetchAllSchemas();
        setListOfSchemas(schemas);
    }

    return <div>
        <Button onClick={listSchemas}>List Schemas</Button>
        <Table dataSource={listOfSchemas} size="small" expandedRowRender={record => <pre>{JSON.stringify(record.model_structure, null, 2)}</pre>}>
            <Column title= 'Schema Id' dataIndex= 'schema_id' key= 'schema_id' />
            <Column title= 'Model Type' dataIndex= 'model_type' key= 'model_type'
                    render={(type: string) => (startCase(type).toString())}/>
            <Column title= 'Payload Location' dataIndex= 'payload_location' key= 'payload_location'
                    render={(loc: string) => (startCase(loc).toString())} />
            <Column
                title="Messages"
                key="messages"
                render={(record) => ( <>
                    <button onClick={() => {setSelectedSchema(record); setShowCreateMessageComp(!showCreateMessageComp)}}>Create Message</button>
                    <button onClick={() => {setSelectedSchema(record); setShowListMessageComp(!showLlistMessageComp)}}>List Messages</button> </>
            )} />
        </Table>
        <CreateMessage schema={selectedSchema} isVisible={showCreateMessageComp}/>
        <ListMessages schema={selectedSchema} isVisible={showLlistMessageComp}/>

    </div>
}

export default ListSchemas;