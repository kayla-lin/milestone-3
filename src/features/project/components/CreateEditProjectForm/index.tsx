import React, { FC } from "react";
import { Button, DatePicker, Form, Input, Modal, Space } from "antd";
import type { FormInstance } from "antd/es/form";
import { AddProjectType } from "./types";

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  initialValues?: AddProjectType;
  onSubmit: (values: AddProjectType) => void;
  onDelete?: () => void;
}

const CreateProjectForm: FC<Props> = ({
  open,
  onClose,
  onSubmit,
  onDelete,
  title,
  initialValues,
}) => {
  const formRef = React.useRef<FormInstance>(null);

  return (
    <Modal title={title} onCancel={onClose} footer={null} open={open}>
      <Form
        layout="vertical"
        ref={formRef}
        initialValues={initialValues}
        name="create-project"
        onFinish={(values) => {
          const { name, description, dueDate } = values;
          onSubmit({ name, description, dueDate: dueDate.toDate() });
          formRef.current?.resetFields();
          onClose();
        }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="name"
          label="Project Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Project Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: onDelete ? "space-between" : "flex-end",
          }}
        >
          {onDelete && (
            <Button key="back" type="dashed" onClick={onDelete}>
              Delete
            </Button>
          )}
          <Space>
            <Button key="back" onClick={onClose}>
              Return
            </Button>
            <Button key="submit" htmlType="submit" type="primary">
              Submit
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateProjectForm;
