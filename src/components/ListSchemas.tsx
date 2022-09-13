import { Button, Table } from "antd";
import React from "react";
import { fetchAllSchemas } from "../services/chain/apis/extrinsic";
import { SchemaDetails } from "../services/schema";
import startCase from 'lodash/startCase';
import './styles.css';
import Column from "antd/lib/table/Column";

const ListSchemas = (): JSX.Element => {
    const [listOfSchemas, setListOfSchemas] = React.useState<SchemaDetails[]>([]);

    const listSchemas = async () => {
        const schemas = await fetchAllSchemas();
        setListOfSchemas(schemas);
    }

    return <>
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
            </Table>
        </>
}

export default ListSchemas;