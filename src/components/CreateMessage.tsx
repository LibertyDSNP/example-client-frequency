import { Button, Form, Input, InputNumber, Typography } from "antd";
import { useState } from "react";
import { addMessage } from "../services/chain/apis/extrinsic";
import { SchemaDetails } from "../services/types";
import { staticSchema } from "./CreateSchema";

const { Text } = Typography;

interface CreateMessageProps {
  schema: SchemaDetails;
}

const CreateMessage = (props: CreateMessageProps): JSX.Element => {
  const [form] = Form.useForm();
  const [isMessageValid, setIsMessageValid] = useState("");

  const example_msg = {
    nickname: "omar",
    favorite_number: 6,
    favorite_restaurant: "Ramen Takeya",
  };

  const handleSubmit = async () => {
    if (validateMessage()) {
      submitMessage();
      form.resetFields();
    } else {
      setIsMessageValid("Message is invalid");
    }
  };

  const validateMessage = (): boolean => {
    console.dir(form.getFieldsValue());
    const isMsgValid = staticSchema.isValid(form.getFieldsValue());
    console.log("is submited message valid", isMsgValid);
    return isMsgValid;
  };

  const submitMessage = async () => {
    let avroBuffer: Buffer = staticSchema.toBuffer(form.getFieldsValue());
    console.log("avro buffer: ", avroBuffer);
    await addMessage(avroBuffer, parseInt(props?.schema?.schema_id));
  };

  return (
    <>
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
          rules={[
            { required: true, message: "Please input the user's nickname" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Favorite Number"
          name="favorite_number"
          rules={[
            {
              required: true,
              message: "Please input the user's favorite number",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Favorite Restaurant"
          name="favorite_restaurant"
          rules={[
            {
              required: true,
              message: "Please input the user's favorite restaurant",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5, span: 10 }}>
          <Button type="primary" htmlType="submit">
            Submit Message
          </Button>
        </Form.Item>
      </Form>
      <Text type="danger">{isMessageValid} </Text>
    </>
  );
};

export default CreateMessage;
