import { Button, Col, Empty, Row, Typography } from "antd";
import React from "react";
import CourseCard from "~/features/course/CourseCard";
import { api } from "~/utils/api";

const Student = () => {
  const { data: courses, isLoading } =
    api.student.getAllPublicCourses.useQuery();

  const utils = api.useContext();

  const enrollCourse = api.student.enrollCourse.useMutation({
    onMutate: async (newEntry: { courseID: number }) => {
      await utils.student.getAllPublicCourses.cancel();
      utils.student.getAllPublicCourses.setData(undefined, (prevEntries) => {
        // Add enrolled student to count
        const addEnrollCount = prevEntries.allCourses.map((course) => {
          if (course.courseID === newEntry.courseID) {
            course.numEnrolled++;
          }
          return course;
        });
        if (prevEntries?.enrolled) {
          return {
            allCourses: addEnrollCount,
            enrolled: [...prevEntries.enrolled, newEntry],
          };
        } else {
          return {
            allCourses: addEnrollCount,
            enrolled: [newEntry],
          };
        }
      });
    },
    onSettled: async () => {
      await utils.student.getAllPublicCourses.invalidate();
    },
  });
  const unenrollCourse = api.student.unenrollCourse.useMutation({
    onMutate: async (newEntry: { courseID: number }) => {
      await utils.student.getAllPublicCourses.cancel();
      utils.student.getAllPublicCourses.setData(undefined, (prevEntries) => {
        // Remove enrolled student from count
        const addEnrollCount = prevEntries.allCourses.map((course) => {
          if (course.courseID === newEntry.courseID) {
            course.numEnrolled--;
          }
          return course;
        });
        if (prevEntries?.enrolled) {
          const removedEntry = prevEntries?.enrolled.filter(
            (course) => course.courseID !== newEntry.courseID
          );
          return {
            allCourses: addEnrollCount,
            enrolled: removedEntry,
          };
        } else {
          return {
            allCourses: addEnrollCount,
            enrolled: [],
          };
        }
      });
    },
    onSettled: async () => {
      await utils.student.getAllPublicCourses.invalidate();
    },
  });

  const enrolledCoursesList = courses?.enrolled.map(
    (course) => course.courseID
  );

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ paddingBottom: "40px" }}>
          <Typography.Title level={2}>Courses</Typography.Title>
          <Typography.Text type="secondary">
            Enroll for your course and start tracking your projects.
          </Typography.Text>
        </div>
      </div>
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <Row gutter={[16, 24]}>
          {courses.allCourses?.map((course) => {
            return (
              <Col className="gutter-row" span={6} key={course.courseID}>
                <CourseCard
                  extra={
                    <>
                      {!enrolledCoursesList.includes(course.courseID) ? (
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => {
                            enrollCourse.mutate({
                              courseID: course.courseID,
                            });
                          }}
                        >
                          Enroll
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          onClick={() => {
                            unenrollCourse.mutate({
                              courseID: course.courseID,
                            });
                          }}
                        >
                          Unenroll
                        </Button>
                      )}
                    </>
                  }
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
      {((!isLoading && !courses) || courses?.allCourses.length === 0) && (
        <Empty />
      )}
    </div>
  );
};

export default Student;
