import { Button, Space, Table } from "antd";
import React, { useState } from "react";
import { fetchAllSchemas } from "../services/chain/apis/extrinsic";
import { SchemaDetails } from "../services/types";
import { lowerCase, upperFirst } from 'lodash';
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
    <Space direction="vertical">
        <Button onClick={listSchemas}>List Schemas</Button>

        <Table dataSource={listOfSchemas} size="small" expandedRowRender={record => <pre>{JSON.stringify(record.model_structure, null, 2)}</pre>}>
            <Column title= 'Schema Id' dataIndex= 'schema_id' key= 'schema_id' />
            <Column title= 'Model Type'dataIndex='model_type' key= 'model_type'
                    render={(type) => upperFirst(lowerCase(type)) }/>
            <Column title= 'Payload Location' dataIndex='payload_location' key= 'payload_location'
                    render={(loc) => upperFirst(lowerCase(loc))} />
            <Column
                title="Messages"
                key="messages"
                render={(record) => ( <>
                      <Space size="middle">
                        <a onClick={() => {setSelectedSchema(record); setShowCreateMessageComp(!showCreateMessageComp)}}>Create Message</a>
                        <a onClick={() => {setSelectedSchema(record); setShowListMessageComp(!showLlistMessageComp)}}>List Messages</a>
                    </Space> </>
            )} />
        </Table>
        <CreateMessage schema={selectedSchema} isVisible={showCreateMessageComp}/>
        <ListMessages schema={selectedSchema} isVisible={showLlistMessageComp}/>
    </Space>
    </div>
}

export default ListSchemas;