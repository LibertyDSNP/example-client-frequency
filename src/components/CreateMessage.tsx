import { Button } from "antd";
import { addMessage } from "../services/chain/apis/extrinsic";
import { staticSchema } from "./RegisterSchema";

const CreateMessage = (): JSX.Element => {
    const submitMessage =  async () => {
        let input =
        {
            "nickname": "omar", "favorite_number": 6, "favorite_restaurant": "Ramen Takeya"
        }
        let message: Buffer = staticSchema.toBuffer({nickname: "omar", favorite_number: 6, favorite_restaurant: "Ramen Takeya"})
        addMessage(message, 1);
        console.log("submit message func finished?");
    }

    return <Button onClick={submitMessage}>Submit Message</Button>
}

export default CreateMessage;