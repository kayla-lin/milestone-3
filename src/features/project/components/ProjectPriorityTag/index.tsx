import { Tag } from "antd";
import React, { FC, ReactNode } from "react";

interface Props {
  priority: string;
  children: ReactNode;
}

const PRIORITY_COLORS: { [key: string]: string } = {
  Low: "purple",
  Medium: "yellow",
  High: "red",
};

const ProjectPriorityTag: FC<Props> = ({ priority, children }) => {
  return <Tag color={PRIORITY_COLORS[priority]}>{children}</Tag>;
};

export default ProjectPriorityTag;
