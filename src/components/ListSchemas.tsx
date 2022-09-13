import { Button, Table } from "antd";
import React from "react";
import { fetchAllSchemas } from "../services/chain/apis/extrinsic";
import './styles.css';

const ListSchemas = (): JSX.Element => {
    const [listOfSchemas, setListOfSchemas] = React.useState<Array<any>>([]);

    const listSchemas = async () => {
        const schemas = await fetchAllSchemas();
        setListOfSchemas(schemas);
    }

    const columns = [
    {
        title: 'Schema Id',
        dataIndex: 'schema_id',
        key: 'schema_id',
        },
        {
        title: 'Model Type',
        dataIndex: 'model_type',
        key: 'model_type',
        },
        {
        title: 'Payload Location',
        dataIndex: 'payload_location',
        key: 'payload_location',
        },
        {
        title: 'Model structure',
        dataIndex: 'model_structure',
        key: 'model_structure',
        },
    ]

    return <>
            <Button onClick={listSchemas}>List Schemas</Button>
            <Table dataSource={listOfSchemas} columns={columns} />
        </>
}

export default ListSchemas;