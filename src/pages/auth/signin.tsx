import React, { useEffect } from "react";
import { Input, Form, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import AuthCard from "~/features/auth/components/AuthCard";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [notiAPI, contextHolder] = notification.useNotification();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.roleID === 1) {
      router.push("/app/instructor");
    }
    if (session?.user.roleID === 2) {
      router.push("/app/student");
    }
  }, [session]);

  const onFinish = async (values: any) => {
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: "/",
        redirect: false,
      });
      if (res?.error) {
        notiAPI.error({
          message: `Error with signing in`,
          description: res.error,
          placement: "top",
        });
        return;
      } else {
        notiAPI.success({
          message: `Success with signing in`,
          description: "You have signed in",
          placement: "top",
        });
      }
    } catch (err) {
      console.log(err);
      notiAPI.error({
        message: `Error with signing in`,
        description: "Request to sign in failed. Please try again",
        placement: "top",
      });
    }
    console.log(session);
  };

  return (
    <AuthCard
      onFinish={onFinish}
      title="Sign In"
      submitButtonText="Sign In"
      link={{
        text: "Don't have an account?",
        url: "/auth/signup",
      }}
    >
      {contextHolder}
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
    </AuthCard>
  );
};

export default SignIn;
