import React from "react";
import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "~/utils/api";

interface DataType {
  projectID: number;
  dueDate: Date;
  description: string;
  courseID: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "courseID",
    dataIndex: "courseID",
    key: "courseID",
  },
  {
    title: "name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "projectID",
    dataIndex: "projectID",
    key: "projectID",
  },
  {
    title: "description",
    dataIndex: "description",
    key: "description",
  },
];

const ProjectTable: React.FC = () => {
  const { data: users, isLoading } = api.viewAll.getProject.useQuery();

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <Card title="Project table" style={{ height: "475px" }}>
      <Table
        bordered
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default ProjectTable;
