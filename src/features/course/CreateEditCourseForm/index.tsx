import React, { FC } from "react";
import { Button, Form, Input, Modal, Space } from "antd";
import type { FormInstance } from "antd/es/form";
import { AddCourseType } from "./types";

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  initialValues?: AddCourseType;
  addCourse: (values: AddCourseType) => void;
  onDelete?: () => void;
}

const CreateEditCourseForm: FC<Props> = ({
  title,
  initialValues,
  open,
  onClose,
  addCourse,
  onDelete,
}) => {
  const formRef = React.useRef<FormInstance>(null);

  return (
    <Modal title={title} onCancel={onClose} open={open} footer={null}>
      <Form
        layout="vertical"
        ref={formRef}
        initialValues={initialValues}
        name="create-course"
        onFinish={(values) => {
          const { name, location } = values;
          addCourse({ name, location });
          formRef.current?.resetFields();
          onClose();
        }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item name="name" label="Course Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="location"
          label="Course Location"
          rules={[{ required: true }]}
        >
          <Input />
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

export default CreateEditCourseForm;
