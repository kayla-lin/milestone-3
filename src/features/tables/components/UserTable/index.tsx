import React from "react";
import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "~/utils/api";

interface DataType {
  userID: number;
  name: string;
  email: string;
  password: string;
  roleID: number;
  createdAt: Date;
}

const columns: ColumnsType<DataType> = [
  {
    title: "userID",
    dataIndex: "userID",
    key: "userID",
  },
  {
    title: "name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "password",
    dataIndex: "password",
    key: "password",
  },
  {
    title: "roleID",
    dataIndex: "roleID",
    key: "roleID",
  },
  {
    title: "createdAt",
    dataIndex: "createdAt",
    key: "createdAt",
  },
];

const UserTable: React.FC = () => {
  const { data: users, isLoading } = api.viewAll.getUser.useQuery();

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <Card title="User table" style={{ height: "475px" }}>
      <Table
        bordered
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default UserTable;
