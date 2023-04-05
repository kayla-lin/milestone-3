import React from "react";
import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "~/utils/api";

interface DataType {
  projectID: number;
  priority: string;
  status: string;
  completedDate: Date;
  userID: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "userID",
    dataIndex: "userID",
    key: "userID",
  },
  {
    title: "status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "projectID",
    dataIndex: "projectID",
    key: "projectID",
  },
  {
    title: "priority",
    dataIndex: "priority",
    key: "priority",
  },
  {
    title: "completedDate",
    dataIndex: "completedDate",
    key: "completedDate",
  },
];

const StudentProjectTable: React.FC = () => {
  const { data: users, isLoading } = api.viewAll.getStudentProject.useQuery();

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <Card title="Student project" style={{ height: "475px" }}>
      <Table
        bordered
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default StudentProjectTable;
