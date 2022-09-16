import { Button, Form, Input, InputNumber } from "antd";
import { addMessage } from "../services/chain/apis/extrinsic";
import { SchemaProps } from "../services/types";
import { staticSchema } from "./RegisterSchema";



const CreateMessage = (props: SchemaProps): JSX.Element => {
    const [form] = Form.useForm();

    const example_msg = { nickname:'omar',favorite_number: 6,favorite_restaurant:'Ramen Takeya'};

    const handleSubmit =  async () => {

        let isValid = validateMessage();
        if (isValid) {
            submitMessage();
        };
        form.resetFields();
    }

    const validateMessage = (): boolean => {
        console.dir(form.getFieldsValue());
        const isMsgValid = staticSchema.isValid(form.getFieldsValue());
        console.log("is submited message valid", isMsgValid);
        return isMsgValid;
    }

    const submitMessage = async () => {
        let avroBuffer: Buffer = staticSchema.toBuffer(form.getFieldsValue());
        console.log("avro buffer: ", avroBuffer);
        await addMessage(avroBuffer, parseInt(props?.schema?.schema_id));
    }

    if (props.isVisible)
    {    return (

            <Form
                name="createMessage"
                form={form}
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 6 }}
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <Form.Item
                    label="Nickname"
                    name="nickname"
                    rules={[{required: true, message: 'Please input the user\'s nickname' }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Favorite Number"
                    name="favorite_number"
                    rules={[{required: true, message: 'Please input the user\'s favorite number' }]}>
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Favorite Restaurant"
                    name="favorite_restaurant"
                    rules={[{required: true, message: 'Please input the user\'s favorite restaurant' }]}>
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 5, span: 10 }}>
                    <Button type="primary" htmlType="submit">
                        Submit Message
                    </Button>
                </Form.Item>
            </Form>
        )}
    else return <></>
}

export default CreateMessage;