import React from "react";
import { Input, Form, Radio, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import AuthCard from "~/features/auth/components/AuthCard";
import { api } from "~/utils/api";

const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [notiAPI, contextHolder] = notification.useNotification();
  const createAccount = api.user.create.useMutation({
    onSuccess: (data) => {
      notiAPI.success({
        message: `Created account at ${data.email}!`,
        description: "Please sign into your account to get started",
        placement: "top",
      });
    },
    onError: (err: any) => {
      notiAPI.error({
        message: `There was an error with creating the account. Does the account already exist?`,
        description: err[0],
        placement: "top",
      });
    },
  });
  const onFinish = async (values: any) => {
    const { name, email, password, roleID } = values;
    createAccount.mutate({
      name,
      email,
      password,
      roleID,
    });
  };

  return (
    <AuthCard
      onFinish={onFinish}
      title="Sign Up"
      submitButtonText="Sign Up"
      link={{
        text: "Have an account?",
        url: "/auth/signin",
      }}
    >
      {contextHolder}
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Required" }]}
      >
        <Input placeholder="Input name" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Required" }]}
      >
        <Input placeholder="Input email" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Required" }]}
      >
        <Input.Password
          placeholder="Input password"
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
          iconRender={(passwordVisible) =>
            !passwordVisible ? <EyeInvisibleOutlined /> : <EyeTwoTone />
          }
        />
      </Form.Item>
      <Form.Item
        label="Account Type"
        name="roleID"
        rules={[{ required: true, message: "Required" }]}
      >
        <Radio.Group>
          <Radio.Button value={1}>Instructor</Radio.Button>
          <Radio.Button value={2}>Student</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </AuthCard>
  );
};

export default SignUp;
