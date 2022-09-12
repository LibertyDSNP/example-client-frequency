import {registerSchema } from "../services/chain/apis/extrinsic";
import {Button} from "antd";
import * as avro from "avsc";
import React from "react";

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
    const doRegisterSchema = async () => {
        // registerSchema(JSON.stringify(staticSchema.schema()));
        registerSchema(JSON.stringify(anotherSchema.schema()));
        console.log("register schema end", staticSchema.schema());
        console.log("register", JSON.stringify(anotherSchema.schema()));
    }

    return <Button onClick={doRegisterSchema}>Register Schema</Button>
}

export default RegisterSchema