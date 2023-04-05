import React, { FC, ReactNode } from "react";
import { Button, Form, Typography, notification } from "antd";
import NextLink from "next/link";
import Logo from "~/components/Logo";

interface Props {
  onFinish: (values: any) => void;
  title: string;
  children: ReactNode;
  submitButtonText: string;
  link: { text: string; url: string };
}

const AuthCard: FC<Props> = ({
  onFinish,
  title,
  children,
  link,
  submitButtonText,
}) => {
  const [form] = Form.useForm();

  return (
    <div
      style={{
        display: "flex",
        height: "90vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Form
        onSubmitCapture={(e) => {
          e.preventDefault();
        }}
        form={form}
        onFinish={(values) => {
          form.resetFields();
          onFinish(values);
        }}
        layout="vertical"
        style={{ width: "300px" }}
        requiredMark={true}
      >
        <div style={{ width: "100%", textAlign: "center" }}>
          <Logo size="lg" />
          <Typography.Text style={{ textAlign: "center", fontSize: "22px" }}>
            {title}
          </Typography.Text>
        </div>

        {children}
        <Form.Item style={{ width: "100%", paddingTop: 10 }}>
          <Button htmlType="submit" type="primary" style={{ width: "100%" }}>
            {submitButtonText}
          </Button>
        </Form.Item>
        <div style={{ width: "100%", textAlign: "center" }}>
          <NextLink href={link.url}>{link.text}</NextLink>
        </div>
      </Form>
    </div>
  );
};

export default AuthCard;
