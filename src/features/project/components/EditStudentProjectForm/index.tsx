import React, { FC } from "react";
import { Button, Form, Modal, Select, Space } from "antd";
import type { FormInstance } from "antd/es/form";
import { api } from "~/utils/api";
import { ProjectDetailsType } from "./types";

interface Props {
  open: boolean;
  project: ProjectDetailsType;
  onClose: () => void;
  editProject: (values: any) => void;
}

const EditStudentProjectForm: FC<Props> = ({
  open,
  onClose,
  editProject,
  project,
}) => {
  const formRef = React.useRef<FormInstance>(null);
  const { data: queriedProject, isLoading } =
    api.student.getStudentProject.useQuery({
      projectID: project.projectID,
    });

  return (
    <Modal
      title={`Edit ${project.name}`}
      onCancel={onClose}
      footer={null}
      open={open}
    >
      {!isLoading && (
        <Form
          layout="vertical"
          ref={formRef}
          initialValues={{
            priority: queriedProject?.priority,
            status: queriedProject?.status,
          }}
          onFinish={(values) => {
            const { priority, status } = values;
            editProject({
              priority,
              status,
              oldStatus: queriedProject.status,
              projectID: queriedProject.projectID,
            });
            formRef.current?.resetFields();
            onClose();
          }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "none", label: "No priority given" },
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
              ]}
            />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "none", label: "No status given" },
                { value: "In progress", label: "In progress" },
                { value: "Completed", label: "Completed" },
              ]}
            />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Space>
              <Button key="back" onClick={onClose}>
                Return
              </Button>
              <Button key="submit" htmlType="submit" type="primary">
                Edit
              </Button>
            </Space>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default EditStudentProjectForm;
