import React, { useState } from "react";
import { addMessage } from "../services/chain/apis/extrinsic";
import { SchemaProps } from "../services/types";
import { staticSchema } from "./RegisterSchema";

const CreateMessage = (props: SchemaProps): JSX.Element => {
    const [messagevalues, setMessageValues] = useState({nickname: "", favorite_number: 0, favorite_restaurant: ""});

    const example_msg = { nickname:'omar',favorite_number: 6,favorite_restaurant:'Ramen Takeya'};

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setMessageValues(values => ({...values, [name]: value }))
    }

    const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = parseInt(event.target.value);
        setMessageValues(values => ({...values, [name]: value }))
    }

    const handleSubmit =  async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let isValid = validateMessage();
        if (isValid) {
            submitMessage();
            setMessageValues({nickname: "", favorite_number: 0, favorite_restaurant: ""});
            var formEl = document.getElementById("message-form");
            (formEl as HTMLFormElement)?.reset();
        };
    }

    const validateMessage = (): boolean => {
        console.dir(messagevalues);
        const isMsgValid = staticSchema.isValid(messagevalues);
        console.log("is submited message valid", isMsgValid);
        return isMsgValid;
    }

    const submitMessage = async () => {
        let avroBuffer: Buffer = staticSchema.toBuffer(messagevalues);
        console.log("avro buffer: ", avroBuffer);
        await addMessage(avroBuffer, parseInt(props?.schema?.schema_id));
    }

    if (props.isVisible)
    {    return (
            <div className="container">
            <form onSubmit={handleSubmit} id="message-form">
                <label>Enter nickname:
                <input
                    type="text"
                    name="nickname"
                    placeholder="Enter nickname"
                    value={messagevalues.nickname}
                    onChange={handleChange} />
                </label>
                <label>Enter Favorite Number:
                <input
                    type="number"
                    name="favorite_number"
                    placeholder="0"
                    value={messagevalues.favorite_number}
                    onChange={handleChangeNumber} />
                </label>
                <label>Enter Favorite Restaurant
                <input
                    type="text"
                    name="favorite_restaurant"
                    placeholder="Enter Restaurant name"
                    value={messagevalues.favorite_restaurant}
                    onChange={handleChange} />
                </label>
            <button type="submit">Submit Message</button>
            </form>
            </div>
        )}
    else return <></>
}

export default CreateMessage;