import {registerSchema } from "../services/chain/apis/extrinsic";
import {Button, Typography} from "antd";
import { useState } from "react";
import * as avro from "avsc";

const {Text} = Typography;

export const staticSchema = avro.Type.forSchema (
    {
        type: 'record',
        name: 'User',
        fields: [
            {name: 'nickname', type: 'string'},
            {name:'favorite_number',type:'int'},
            {name:'favorite_restaurant',type:'string'}
        ]
    }
)

export const anotherSchema = avro.Type.forSchema (

        {
            type: "record",
            name: "AvrosampleNetCore.AccountDetails",
            fields: [
              {
                name: "AccountId",
                type: "int"
              },
              {
                name: "AccountName",
                type: "string"
              },
              {
                name: "Accounts",
                type: [
                  "null",
                  {
                    type: "array",
                    items: {
                      type: "record",
                      name: "AvrosampleNetCore.SubAccounts",
                      fields: [
                        {
                          name: "AccountId",
                          type: "int"
                        },
                        {
                          name: "AccountType",
                          type: [ "null", "string" ]
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }

)

const RegisterSchema = (): JSX.Element => {


    const [schemaRegistered, setSchemaRegistered] = useState("");

    const doRegisterSchema = async () => {
        await registerSchema(JSON.stringify(staticSchema.schema()));
        await registerSchema(JSON.stringify(anotherSchema.schema()));
        setSchemaRegistered("Schema Registered successfully");
    }

    return (
      <>
      <Button onClick={doRegisterSchema}>Register Schema</Button>
      <Text>{schemaRegistered}</Text>
      </>
    )
}

export default RegisterSchema