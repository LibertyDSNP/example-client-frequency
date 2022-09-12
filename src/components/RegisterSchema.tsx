import {registerSchema, staticSchema, anotherSchema } from "../services/chain/apis/extrinsic";
import {Button} from "antd";

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