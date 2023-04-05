import {
  Button,
  Typography,
  Table,
  Space,
  Row,
  Col,
  Card,
  Statistic,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import React, { useState } from "react";
import CreateEditCourseForm from "~/features/course/CreateEditCourseForm";
import CreateEditProjectForm from "~/features/project/components/CreateEditProjectForm";
import { AddProjectType } from "~/features/project/components/CreateEditProjectForm/types";
import useDisclosure from "~/hooks/useDisclosure";
import { api } from "~/utils/api";
import dayjs from "dayjs";

type InstructorProjectType = {
  projectID: number;
  name: string;
  courseID: number;
  dueDate: Date;
  description: string;
};

// TODO: This is a really large page, make this into smaller parts if enough time
const ViewCourse = () => {
  // Router
  const router = useRouter();
  const { courseID } = router.query;

  const utils = api.useContext();
  const { data: course, isLoading } =
    api.instructor.viewInstructorCourse.useQuery({
      courseID: parseInt(courseID as string),
    });

  // React Query project

  const [selectedProject, setSelectedProject] = useState<InstructorProjectType>(
    {
      projectID: -1,
      dueDate: new Date(),
      courseID: -1,
      name: "",
      description: "",
    }
  );

  const createProject = api.instructor.createCourseProject.useMutation({
    onMutate: async (newEntry: InstructorProjectType) => {
      await utils.instructor.viewInstructorCourse.cancel();
      utils.instructor.viewInstructorCourse.setData(
        { courseID: parseInt(courseID as string) },
        (prevEntries) => {
          console.log(prevEntries);
          if (prevEntries?.projects) {
            return {
              info: prevEntries?.info,
              projects: [...prevEntries.projects, newEntry],
            };
          } else {
            return {
              info: prevEntries?.info,
              projects: [newEntry],
            };
          }
        }
      );
    },
    onSettled: async () => {
      await utils.instructor.getAllInstructorCourse.invalidate();
    },
  });

  const deleteProject = api.instructor.deleteCourseProject.useMutation({
    onMutate: async (newEntry: InstructorProjectType) => {
      await utils.instructor.viewInstructorCourse.cancel();
      utils.instructor.viewInstructorCourse.setData(
        { courseID: parseInt(courseID as string) },
        (prevEntries) => {
          const newProjects = prevEntries?.projects.filter(
            (project) => project.projectID !== newEntry.projectID
          );
          return {
            info: prevEntries?.info,
            projects: newProjects,
          };
        }
      );
    },
    onSettled: async () => {
      await utils.instructor.getAllInstructorCourse.invalidate();
    },
  });

  const editProject = api.instructor.editCourseProject.useMutation({
    onMutate: async (newEntry: InstructorProjectType) => {
      await utils.instructor.viewInstructorCourse.cancel();
      utils.instructor.viewInstructorCourse.setData(
        { courseID: parseInt(courseID as string) },
        (prevEntries) => {
          const newProjects = prevEntries?.projects.map((project) => {
            if (project.projectID === newEntry.projectID) {
              project = newEntry;
            }
            return project;
          });
          return {
            info: prevEntries?.info,
            projects: newProjects,
          };
        }
      );
    },
    onSettled: async () => {
      await utils.instructor.getAllInstructorCourse.invalidate();
    },
  });

  const {
    open: editProjectOpen,
    showDrawer: editProjectShowDrawer,
    onClose: editProjectOnClose,
  } = useDisclosure();

  const handleEditProjectClose = () => {
    setSelectedProject({
      projectID: -1,
      dueDate: new Date(),
      courseID: -1,
      name: "",
      description: "",
    });
    editProjectOnClose();
  };

  // React Query course
  const editCourse = api.instructor.editCourse.useMutation({
    onMutate: async (newEntry: {
      name: string;
      location: string;
      courseID: number;
    }) => {
      await utils.instructor.viewInstructorCourse.cancel();
      utils.instructor.viewInstructorCourse.setData(
        { courseID: parseInt(courseID as string) },

        (prevEntries) => {
          console.log(prevEntries);
          console.log(newEntry);
          return {
            info: {
              ...prevEntries.info,
              location: newEntry.location,
              courseName: newEntry.name,
            },
            projects: prevEntries.projects,
          };
        }
      );
    },
    onSettled: async () => {
      await utils.instructor.getAllInstructorCourse.invalidate();
    },
  });

  const deleteCourse = api.instructor.deleteCourse.useMutation();

  // Modals
  const {
    open: createProjectOpen,
    showDrawer: createProjectShowDrawer,
    onClose: createProjectOnClose,
  } = useDisclosure();

  const {
    open: editCourseOpen,
    showDrawer: editCourseShowDrawer,
    onClose: editCourseOnClose,
  } = useDisclosure();

  // Project handlers
  const handleAddProject = async (values: AddProjectType) => {
    const res = createProject.mutate({
      courseID: parseInt(courseID as string),
      name: values.name,
      description: values.description,
      dueDate: new Date(values.dueDate),
    });
    console.log(res);
  };

  const handleEditProject = async (values: AddProjectType) => {
    editProject.mutate({
      ...values,
      projectID: selectedProject?.projectID,
      dueDate: new Date(values.dueDate),
    });
  };

  const handleDeleteProject = async () => {
    deleteProject.mutate({ projectID: selectedProject.projectID });
  };

  // Course handlers
  const handleEditCourse = (values: any) => {
    const { location, name } = values;
    editCourse.mutate({
      location,
      name,
      courseID: parseInt(courseID as string),
    });
  };

  const handleDeleteCourse = async () => {
    const id = parseInt(courseID as string);
    deleteCourse.mutate({ courseID: id });
    router.push("/app/instructor");
  };

  const columns: ColumnsType<{
    name: string;
    projectID: number;
    courseID: number;
    description: string;
    title: string;
    dueDate: Date;
  }> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Project ID",
      dataIndex: "projectID",
      key: "projectID",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Due date",
      dataIndex: "dueDate",
      render: (date) => <p>{date.toDateString()}</p>,
      key: "dueDate",
    },
    {
      title: "",
      key: "edit",
      dataIndex: "",
      render: (project) => (
        <Button
          onClick={() => {
            console.log(new Date());
            console.log(project);
            setSelectedProject(project);
            editProjectShowDrawer();
          }}
        >
          Edit Project
        </Button>
      ),
    },
  ];

  return (
    <>
      {!isLoading && (
        <>
          <CreateEditCourseForm
            title="Course Editor"
            open={editCourseOpen}
            onClose={editCourseOnClose}
            onDelete={handleDeleteCourse}
            initialValues={{
              location: course.info.location,
              name: course.info.courseName,
            }}
            addCourse={handleEditCourse}
          />
          <CreateEditProjectForm
            title="Project Creator"
            open={createProjectOpen}
            onClose={createProjectOnClose}
            onSubmit={handleAddProject}
          />
          <CreateEditProjectForm
            title="Project Editor"
            initialValues={{
              name: selectedProject?.name,
              dueDate: dayjs(selectedProject?.dueDate.toLocaleDateString()),
              description: selectedProject?.description,
            }}
            open={editProjectOpen && selectedProject?.name.length > 0}
            onClose={handleEditProjectClose}
            onSubmit={handleEditProject}
            onDelete={handleDeleteProject}
          />
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Typography.Title level={4}>
                  {course.info.courseName}
                </Typography.Title>
                <Typography.Text type="secondary">
                  {course.info.location}
                </Typography.Text>
              </div>
              <Space>
                <Button
                  size="large"
                  onClick={() => {
                    editCourseShowDrawer();
                  }}
                >
                  Edit Course
                </Button>
                <Button
                  size="large"
                  type="primary"
                  onClick={() => {
                    createProjectShowDrawer();
                  }}
                >
                  Add Project
                </Button>
              </Space>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic
                    title="Projects Created"
                    value={course.info.numProjects}
                    suffix=" projects"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic
                    title="Students Enrolled"
                    value={course.info.numEnrolled}
                    suffix=" students"
                  />
                </Card>
              </Col>
            </Row>
            <Table
              bordered
              columns={columns}
              dataSource={course.projects}
              pagination={{ pageSize: 5 }}
            />
          </Space>
        </>
      )}
    </>
  );
};

export default ViewCourse;
