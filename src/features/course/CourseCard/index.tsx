import { Card, Space, Tag } from "antd";
import Link from "next/link";
import React, { FC, ReactNode } from "react";

interface Props {
  name: string;
  instructor: string;
  location: string;
  courseID: number;
  numEnrolled: number;
  projectNumber: number;
  extra?: ReactNode;
}

const CourseCard: FC<Props> = ({
  name,
  instructor,
  location,
  courseID,
  numEnrolled,
  projectNumber,
  extra,
}) => {
  return (
    <Card title={name} extra={extra} style={{ height: "200px" }}>
      <Space size={[0, 8]} wrap>
        <Tag color="magenta">Instructor: {instructor}</Tag>
        <Tag color="green">Location: {location}</Tag>
        <Tag color="blue">Enrolled: {String(numEnrolled)}</Tag>
        <Tag color="orange">Projects: {String(projectNumber)}</Tag>
        <Tag color="gold">Course ID: {courseID}</Tag>
      </Space>
    </Card>
  );
};

export default CourseCard;
