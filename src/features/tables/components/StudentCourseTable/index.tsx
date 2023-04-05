import React from "react";
import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "~/utils/api";

interface DataType {
  courseID: number;
  userID: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "userID",
    dataIndex: "userID",
    key: "userID",
  },
  {
    title: "courseID",
    dataIndex: "courseID",
    key: "courseID",
  },
];

const StudentCourseTable: React.FC = () => {
  const { data: users, isLoading } = api.viewAll.getStudentCourse.useQuery();

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <Card title="Student course table" style={{ height: "475px" }}>
      <Table
        bordered
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default StudentCourseTable;
