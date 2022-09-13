import React, { useState } from "react";
import { addMessage } from "../services/chain/apis/extrinsic";
import { staticSchema } from "./RegisterSchema";

const CreateMessage = (): JSX.Element => {
    const [messagevalues, setMessageValues] = useState({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setMessageValues(values => ({...values, [name]: value }))
    }

    const handleSubmit =  async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert(messagevalues);
        validateMessage();
        console.log(messagevalues);
        submitMessage();
    }

    const validateMessage = () => {
        const valid = staticSchema.isValid({ nickname:'omar',favorite_number: 6,favorite_restaurant:'Ramen Takeya'});
        console.log("is valid? ", valid);
    }

    const submitMessage =  async () => {
        let input =
        {
            "nickname": "omar", "favorite_number": 6, "favorite_restaurant": "Ramen Takeya"
        }
        let message: Buffer = staticSchema.toBuffer({nickname: "omar", favorite_number: 6, favorite_restaurant: "Ramen Takeya"})
        addMessage(message, 2);
        console.log("submit message func finished?");
    }

    return (
        <div className="container">
        <form onSubmit={handleSubmit}>
            <label>Enter nickname:
            <input
                type="text"
                name="nickname"
                placeholder="Enter nickname"
                className="input"
                onChange={handleChange} />
            </label>
            <label>Enter Favorite Number:
            <input
                type="number"
                name="favoriteNumber"
                placeholder="0"
                className="input"
                onChange={handleChange} />
            </label>
            <label>Enter Favorite Restaurant
            <input
                type="text"
                name="favoriteRestaurant"
                placeholder="Enter Restaurant name"
                className="input"
                onChange={handleChange} />
            </label>
        <button type="submit" className="btn">Create Message</button>
        </form>
        </div>
    )
}

export default CreateMessage;