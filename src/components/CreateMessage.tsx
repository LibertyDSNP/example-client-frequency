import React, { useState } from "react";
import { addMessage } from "../services/chain/apis/extrinsic";
import { SchemaDetails } from "../services/types";
import { staticSchema } from "./RegisterSchema";

interface messageProps {
    schema: SchemaDetails
}
const CreateMessage = (props: messageProps): JSX.Element => {
    const [messagevalues, setMessageValues] = useState({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setMessageValues(values => ({...values, [name]: value }))
    }

    const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = parseFloat(event.target.value);
        setMessageValues(values => ({...values, [name]: value }))
    }

    const handleSubmit =  async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isValid = validateMessage();
        if (isValid) submitMessage();
    }

    const validateMessage = (): boolean => {
        const valid = staticSchema.isValid({ nickname:'omar',favorite_number: 6,favorite_restaurant:'Ramen Takeya'});
        // console.log("is example valid? ", valid);
        console.dir(messagevalues);
        const isMsgValid = staticSchema.isValid(messagevalues);
        console.log("is submited message valid", isMsgValid);
        return isMsgValid;
    }

    const submitMessage =  async () => {
        let message: Buffer = staticSchema.toBuffer(messagevalues);
        addMessage(message,parseInt(props?.schema?.schema_id));
        console.log(props.schema?.schema_id);
        console.log("submit message func finished");
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
                name="favorite_number"
                placeholder="0"
                className="input"
                onChange={handleChangeNumber} />
            </label>
            <label>Enter Favorite Restaurant
            <input
                type="text"
                name="favorite_restaurant"
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