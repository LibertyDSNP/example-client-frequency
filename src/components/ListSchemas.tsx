import { Button, Radio, Table } from "antd";
import React, { useState } from "react";
import { fetchAllSchemas } from "../services/chain/apis/extrinsic";
import { SchemaDetails } from "../services/types";
import startCase from 'lodash/startCase';
import './styles.css';
import Column from "antd/lib/table/Column";

interface schemaProps {
    callback: (record: SchemaDetails) => void;
}

const ListSchemas = (props: schemaProps): JSX.Element => {
    const [listOfSchemas, setListOfSchemas] = React.useState<SchemaDetails[]>([]);

    const listSchemas = async () => {
        const schemas = await fetchAllSchemas();
        setListOfSchemas(schemas);
    }

    return <div>
            <Button onClick={listSchemas}>List Schemas</Button>
            <Table dataSource={listOfSchemas}>
                <Column title= 'Schema Id' dataIndex= 'schema_id' key= 'schema_id' />
                <Column title= 'Model Type' dataIndex= 'model_type' key= 'model_type'
                        render={(type: string) => (startCase(type).toString())}/>
                <Column title= 'Payload Location' dataIndex= 'payload_location' key= 'payload_location'
                        render={(loc: string) => (startCase(loc).toString())} />
                <Column
                    title="Model Structure"
                    dataIndex="model_structure"
                    key="model_structure"
                    render={(sch: JSON) => (
                        <pre>
                            {JSON.stringify({sch}, null, 2)}
                        </pre>
                    )} />
                     <Column
                        title="Messages"
                        key="createMessage"
                        render={(record) => (
                            <button onClick={() => props.callback(record)}>Create Message</button>
                    )} />
            </Table>
        </div>
}

export default ListSchemas;