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

export const staticSchemaJson = {
    fields: [
      {
        "field_id": "nickname",
        "field_label": "Nickname",
        "field_placeholder": "Enter Nickname",
        "field_type": "text",
      },
      {
        "field_id": "favorite_number",
        "field_label": "Favorite Number",
        "field_placeholder": "Enter your favorite number",
        "field_type": "number",
      },
      {
        "field_id": "favorite_restaurant",
        "field_label": "Favorite Restaurant",
        "field_placeholder": "Enter your favorite restaurant",
        "field_type": "text",
      }
    ]
}

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
        registerSchema(JSON.stringify(staticSchema.schema()));
        //registerSchema(JSON.stringify(anotherSchema.schema()));
        console.log("register schema end", staticSchema.schema());
        console.log("register", JSON.stringify(anotherSchema.schema()));
    }

    return <Button onClick={doRegisterSchema}>Register Schema</Button>
}

export default RegisterSchema