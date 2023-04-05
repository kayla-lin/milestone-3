import { Tag } from "antd";
import React, { FC, ReactNode } from "react";

interface Props {
  status: string;
  children: ReactNode;
}

const STATUS_COLORS: { [key: string]: string } = {
  "In progress": "purple",
  Completed: "green",
};

const ProjectStatusTag: FC<Props> = ({ status, children }) => {
  return <Tag color={STATUS_COLORS[status]}>{children}</Tag>;
};

export default ProjectStatusTag;
