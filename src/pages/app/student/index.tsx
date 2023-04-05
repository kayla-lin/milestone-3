import { Button, Card, Empty, Space, Tag, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { ClockCircleOutlined, EditOutlined } from "@ant-design/icons";
import EditStudentProjectForm from "~/features/project/components/EditStudentProjectForm";
import useDisclosure from "~/hooks/useDisclosure";
import { ProjectDetailsType } from "~/features/project/components/EditStudentProjectForm/types";
import ProjectStatusTag from "~/features/project/components/ProjectStatusTag";
import ProjectPriorityTag from "~/features/project/components/ProjectPriorityTag";

const Tracker = () => {
  const utils = api.useContext();
  const { data: projects, isLoading } =
    api.student.getStudentProjects.useQuery();
  const updateCourseProject = api.student.updateStudentProject.useMutation({
    onMutate: async (newEntry: {
      projectID: number;
      status: string;
      completedDate?: Date;
      priority: string;
    }) => {
      await utils.student.getAllPublicCourses.cancel();
      utils.student.getStudentProjects.setData(undefined, (prevEntries) => {
        // Replace old project with new project
        const addEnrollCount = prevEntries?.map((course) => {
          if (course.projectID === newEntry.projectID) {
            course.priority = newEntry.priority;
            course.status = newEntry.status;
            if (newEntry.status === "Completed") {
              course.completedDate = new Date();
            }
          }
          return course;
        });
        return addEnrollCount;
      });
    },
    onSettled: async () => {
      await utils.student.getAllPublicCourses.invalidate();
    },
  });

  const [selectedProject, setSelectedProject] = useState<ProjectDetailsType>({
    projectID: -1,
    name: "",
  });

  const router = useRouter();
  const { open, showDrawer, onClose } = useDisclosure();

  const editProject = (values: any) => {
    const { projectID, priority, status, oldStatus } = values;
    updateCourseProject.mutate({ projectID, priority, status, oldStatus });
  };

  const handleClose = () => {
    setSelectedProject({
      projectID: -1,
      name: "",
    });
    onClose();
  };

  return (
    <div>
      <EditStudentProjectForm
        open={open}
        onClose={handleClose}
        project={selectedProject}
        editProject={editProject}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "40px",
        }}
      >
        <div>
          <Typography.Title level={2}>Tracker</Typography.Title>
          <Typography.Text type="secondary">
            Keep track of your projects.
          </Typography.Text>
        </div>
      </div>
      {!isLoading && (
        <Space direction="vertical" style={{ width: "100%" }}>
          {projects?.map((sp) => (
            <Card key={sp.projectID}>
              <Space
                size="small"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography.Text>{sp.project.name}</Typography.Text>
                  <Typography.Text type="secondary">
                    {sp.project.description}
                  </Typography.Text>
                </div>
                <Space>
                  <Tag>{sp?.project.course.name}</Tag>
                  <Tag icon={<ClockCircleOutlined />}>
                    {sp?.project.dueDate.toDateString()}
                  </Tag>
                  {sp?.status !== "none" && (
                    <ProjectStatusTag status={sp?.status}>
                      {sp?.status} {sp?.completedDate && "on "}
                      {sp?.completedDate?.toDateString()}
                    </ProjectStatusTag>
                  )}
                  {sp?.priority !== "none" && (
                    <ProjectPriorityTag priority={sp?.priority}>
                      {sp?.priority}
                    </ProjectPriorityTag>
                  )}

                  <Button
                    onClick={() => {
                      setSelectedProject({
                        projectID: sp?.projectID,
                        name: sp?.project.name,
                      });
                      showDrawer();
                    }}
                    icon={<EditOutlined style={{ fontSize: "1rem" }} />}
                  >
                    Edit
                  </Button>
                </Space>
              </Space>
            </Card>
          ))}
        </Space>
      )}
      {projects?.length === 0 && (
        <Empty description="No courses enrolled in yet.">
          <Button
            type="primary"
            onClick={() => {
              router.push("/app/student/enroll");
            }}
          >
            Enroll now
          </Button>
        </Empty>
      )}
    </div>
  );
};

export default Tracker;
