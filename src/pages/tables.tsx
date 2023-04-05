import { Layout, Space } from "antd";
import React from "react";
import CourseTable from "~/features/tables/components/CourseTable";
import ProjectTable from "~/features/tables/components/ProjectTable";
import RoleTable from "~/features/tables/components/RoleTable";
import StudentCourseTable from "~/features/tables/components/StudentCourseTable";
import StudentProjectTable from "~/features/tables/components/StudentProjectTable";
import UserTable from "~/features/tables/components/UserTable";

const Tables = () => {
  return (
    <Layout.Content style={{ padding: "50px" }}>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <RoleTable />
        <UserTable />
        <CourseTable />
        <ProjectTable />
        <StudentProjectTable />
        <StudentCourseTable />
      </Space>
    </Layout.Content>
  );
};

export default Tables;
