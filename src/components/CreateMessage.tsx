import { Button } from "antd";
import React from "react";
import { addMessage } from "../services/chain/apis/extrinsic";
import { staticSchema, staticSchemaJson } from "./RegisterSchema";
import staticschemaFields from './staticschemaFields.json';
import { useState, useEffect } from "react";
import { Element } from './shared/Element';

const CreateMessage = (): JSX.Element => {

    const [elements, setElements] = useState(null);

    useEffect(() => setElements(staticschemaFields[0]),[]);

    // const {fields, page_label} = elements??{};

    const submitMessage =  async () => {
        let input =
        {
            "nickname": "omar", "favorite_number": 6, "favorite_restaurant": "Ramen Takeya"
        }
        let message: Buffer = staticSchema.toBuffer({nickname: "omar", favorite_number: 6, favorite_restaurant: "Ramen Takeya"})
        addMessage(message, 1);
        console.log("submit message func finished?");
    }

    console.log("static schema fields", staticSchemaJson);

    return (
        <div className="container">
        <form>
            <div className="form-group">
            <label htmlFor="nickname">Enter Nickname:</label>
                <input
                    type="text"
                    className="form-control"
                    id="nickname"
                    placeholder="Enter nickname" />
            </div>
            <div className="form-group">
            <label>Enter Favorite Number:</label>
            <input
                type="number"
                className="form-control"
                id="favoriteNumber"
                placeholder="0" />
            </div>
            <div className="form-group">
            <label>Enter Favorite Restaurant</label>
            <input
                type="text"
                className="form-control"
                id="favoriteRestaurant"
                placeholder="Enter Restaurant name"  />
            </div>
            <div>
                <Button onClick={submitMessage}>Submit Message</Button>
            </div>
        </form>
        </div>
    )

}

export default CreateMessage;