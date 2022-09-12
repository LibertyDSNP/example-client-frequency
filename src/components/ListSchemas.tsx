import { Button } from "antd";
import React from "react";
import { fetchAllSchemas } from "../services/chain/apis/extrinsic";
import './styles.css';

const ListSchemas = (): JSX.Element => {
    const [listOfSchemas, setListOfSchemas] = React.useState<Array<any>>([]);

    const listSchemas = async () => {
        const schemas = await fetchAllSchemas();
        setListOfSchemas(schemas);
    }

    return <>
            <Button onClick={listSchemas}>List Schemas</Button>
            <div>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Model</th>
                </tr>
                {listOfSchemas?.map((sch) =>
                    <tr>
                        <td>{sch.id}</td>
                        <td>{sch.type}</td>
                        <td>{sch.location}</td>
                        <td><pre>{sch.modelParsed}</pre></td>
                    </tr>
                )}
            </table>
            </div>
        </>
}

export default ListSchemas;