import { Button, Col, Empty, Row, Typography } from "antd";
import Link from "next/link";
import CourseCard from "~/features/course/CourseCard";
import CreateEditCourseForm from "~/features/course/CreateEditCourseForm";
import { AddCourseType } from "~/features/course/CreateEditCourseForm/types";
import useDisclosure from "~/hooks/useDisclosure";
import { api } from "~/utils/api";

export default function Instructor() {
  const { open, showDrawer, onClose } = useDisclosure();

  const utils = api.useContext();
  const { data: instructorCourses, isLoading } =
    api.instructor.getAllInstructorCourse.useQuery();

  const createCourse = api.instructor.createCourse.useMutation({
    onMutate: async (newEntry: {
      courseName: string;
      location: string;
      numProjects: number;
      numEnrolled: number;
      courseID: number;
      instructorName: string;
    }) => {
      await utils.instructor.getAllInstructorCourse.cancel();
      utils.instructor.getAllInstructorCourse.setData(
        undefined,
        (prevEntries) => {
          if (prevEntries) {
            return [newEntry, ...prevEntries];
          } else {
            return [newEntry];
          }
        }
      );
    },
    onSettled: async () => {
      await utils.instructor.getAllInstructorCourse.invalidate();
    },
  });

  const handleCreateCourse = (values: AddCourseType) => {
    createCourse.mutate({
      name: values.name,
      location: values.location,
    });
  };

  return (
    <>
      <CreateEditCourseForm
        title="Course Creator"
        onClose={onClose}
        open={open}
        addCourse={handleCreateCourse}
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
          <Typography.Title level={2}>Courses</Typography.Title>
          <Typography.Text type="secondary">
            Manage and add courses.
          </Typography.Text>
        </div>
        <Button
          size="large"
          type="primary"
          onClick={() => {
            showDrawer();
          }}
        >
          Add Course
        </Button>
      </div>
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <Row gutter={[16, 24]}>
          {instructorCourses?.map((course) => {
            return (
              <Col className="gutter-row" span={6}>
                <CourseCard
                  extra={
                    <Link href={`/app/instructor/course/${course.courseID}`}>
                      View
                    </Link>
                  }
                  key={course.courseID}
                  name={course.courseName}
                  instructor={course.instructorName}
                  location={course.location}
                  courseID={course.courseID}
                  numEnrolled={course.numEnrolled}
                  projectNumber={course.numProjects}
                />
              </Col>
            );
          })}
        </Row>
      )}
      {((!isLoading && !instructorCourses) ||
        instructorCourses?.length === 0) && <Empty />}
    </>
  );
}
