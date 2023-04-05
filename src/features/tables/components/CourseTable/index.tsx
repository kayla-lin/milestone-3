import React from "react";
import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "~/utils/api";

interface DataType {
  courseID: number;
  name: string;
  location: string;
  instructorID: number;
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
    title: "location",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "instructorID",
    dataIndex: "instructorID",
    key: "instructorID",
  },
];

const CourseTable: React.FC = () => {
  const { data: users, isLoading } = api.viewAll.getCourse.useQuery();

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <Card title="Course table" style={{ height: "475px" }}>
      <Table
        bordered
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default CourseTable;
