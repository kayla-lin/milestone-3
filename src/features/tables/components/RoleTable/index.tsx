import React from "react";
import { Card, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "~/utils/api";

interface DataType {
  id: number;
  name: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "name",
    dataIndex: "name",
    key: "name",
  },
];

const RoleTable: React.FC = () => {
  const { data: users, isLoading } = api.viewAll.getRole.useQuery();

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <Card title="Role table">
      <Table
        bordered
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default RoleTable;
