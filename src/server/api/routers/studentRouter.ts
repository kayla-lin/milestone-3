import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";
import { CourseInfo } from "./types";
import { Prisma } from "@prisma/client";

type StudentProjectType = {
  project: {
    course: { name: string };
    name: string;
    dueDate: Date;
    description: string;
  };
  projectID: number;
  status: string;
  priority: string;
  completedDate: Date;
};

export const studentRouter = createTRPCRouter({
  getAllPublicCourses: protectedProcedure.query(async (req) => {
    const allCourses: CourseInfo[] = await prisma.$queryRaw(
      Prisma.sql`
        select c.courseID, c.name as courseName, c.location, u.name as instructorName, count(p.courseID) as numProjects, count(sc.courseID) as numEnrolled
        from course c
        left join Project p on c.courseID = p.courseID
        left join StudentCourse sc on sc.courseID = c.courseID
        left join user u on c.instructorID = u.userID
        group by c.courseID;    `
    );

    const { session } = req.ctx;
    const studentID = Number(session.user.id);

    const enrolled = await prisma.studentCourse.findMany({
      where: {
        userID: studentID,
      },
      select: {
        courseID: true,
      },
    });

    return { allCourses, enrolled };
  }),
  // Enrolling
  enrollCourse: protectedProcedure
    .input(
      z.object({
        courseID: z.number(),
      })
    )
    .mutation(async (req) => {
      const { session } = req.ctx;
      // TODO: Person is enrolling in their own course

      const studentID = Number(session.user.id);
      const courseID = req.input.courseID;

      // Enroll student in course
      const course = await prisma.studentCourse.create({
        data: {
          userID: studentID,
          courseID: courseID,
        },
      });

      const projects = await prisma.project.findMany({
        where: {
          courseID: courseID,
        },
      });

      const newStudentProjects = projects?.map((project) => {
        return {
          projectID: project.projectID,
          userID: studentID,
          status: "none",
          priority: "none",
        };
      });

      // Create student project for project in the course
      await prisma.studentProject.createMany({ data: newStudentProjects });

      return course;
    }),
  unenrollCourse: protectedProcedure
    .input(
      z.object({
        courseID: z.number(),
      })
    )
    .mutation(async (req) => {
      const { session } = req.ctx;

      // TODO: Person is unenrolling in their own course

      const studentID = Number(session.user.id);
      const courseID = Number(req.input.courseID);

      const projects = await prisma.project.findMany({
        where: {
          courseID: courseID,
        },
      });

      const deletedProjects = projects?.map((project) => {
        return project.projectID;
      });

      await prisma.studentProject.deleteMany({
        where: {
          projectID: {
            in: deletedProjects, // Array of project IDs to delete
          },
          userID: studentID,
        },
      });

      await prisma.studentCourse.delete({
        where: {
          userID_courseID: {
            userID: studentID,
            courseID: courseID,
          },
        },
      });

      return courseID;
    }),
  getEnrolledCourses: protectedProcedure.query(async (req) => {
    const { session } = req.ctx;
    const studentID = Number(session.user.id);
    const courseInfo = await prisma.studentCourse.findMany({
      where: {
        userID: studentID,
      },
      select: {
        courseID: true,
      },
    });

    return courseInfo;
  }),
  getStudentProjects: protectedProcedure.query(async (req) => {
    const { session } = req.ctx;
    const studentID = Number(session.user.id);

    const projects: StudentProjectType[] = await prisma.studentProject.findMany(
      {
        where: {
          userID: studentID,
        },
        select: {
          priority: true,
          status: true,
          projectID: true,
          completedDate: true,
          project: {
            select: {
              name: true,
              dueDate: true,
              description: true,
              course: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }
    );
    return projects;
  }),
  getStudentProject: protectedProcedure
    .input(z.object({ projectID: z.number() }))
    .query(async (req) => {
      const { projectID } = req.input;
      const studentID = Number(req.ctx.session.user.id);
      const project = await prisma.studentProject.findUnique({
        where: {
          userID_projectID: {
            projectID,
            userID: studentID,
          },
        },
      });
      return project;
    }),
  updateStudentProject: protectedProcedure
    .input(
      z.object({
        projectID: z.number(),
        status: z.string(),
        oldStatus: z.string(),
        priority: z.string(),
      })
    )
    .mutation(async (req) => {
      const { status, projectID, priority, oldStatus } = req.input;
      const studentID = Number(req.ctx.session.user.id);

      let updatedData: {
        status: string;
        priority: string;
        completedDate?: Date;
      } = {
        status,
        priority,
      };
      // If status is completed, set completed date
      if (status === "Completed") {
        updatedData = { ...updatedData, completedDate: new Date() };
      }
      // If status is changed from completed, remove completed Date
      if (oldStatus === "Completed" && status !== "Completed") {
        updatedData = { ...updatedData, completedDate: null };
      }

      const project = await prisma.studentProject.update({
        where: {
          userID_projectID: {
            projectID,
            userID: studentID,
          },
        },
        data: updatedData,
      });
      return project;
    }),
});
