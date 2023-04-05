import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { CourseInfo } from "./types";

export const instructorRouter = createTRPCRouter({
  createCourse: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        location: z.string(),
      })
    )
    .output(
      z.object({
        courseName: z.string(),
        location: z.string(),
        numProjects: z.number(),
        numEnrolled: z.number(),
        courseID: z.number(),
        instructorName: z.string(),
      })
    )
    .mutation(async (req) => {
      const { name, location } = req.input;
      const { session } = req.ctx;
      // TODO: Person is editing their own course

      const instructorID = Number(session.user.id);
      const course = await prisma.course.create({
        data: {
          instructorID,
          name,
          location,
        },
      });

      return {
        courseName: course.name,
        location: course.location,
        numProjects: 0,
        numEnrolled: 0,
        courseID: course.courseID,
        instructorName: session.user.name,
      };
    }),
  editCourse: protectedProcedure
    .input(
      z.object({
        courseID: z.number(),
        name: z.string(),
        location: z.string(),
      })
    )
    .mutation(async (req) => {
      const { name, location, courseID } = req.input;
      const course = await prisma.course.update({
        where: {
          courseID,
        },
        data: {
          name,
          location,
        },
      });
      return course;
    }),
  deleteCourse: protectedProcedure
    .input(
      z.object({
        courseID: z.number(),
      })
    )
    .mutation(async (req) => {
      const { courseID } = req.input;
      const course = await prisma.course.delete({
        where: {
          courseID,
        },
      });
      return course;
    }),
  createCourseProject: protectedProcedure
    .input(
      z.object({
        courseID: z.number(),
        name: z.string(),
        description: z.string(),
        dueDate: z.date(),
      })
    )
    .mutation(async (req) => {
      const { courseID, name, description, dueDate } = req.input;
      const { session } = req.ctx;
      // TODO: Person is editing their own course
      const project = await prisma.project.create({
        data: {
          name,
          courseID,
          dueDate,
          description,
        },
      });
      return project;
    }),
  editCourseProject: protectedProcedure
    .input(
      z.object({
        projectID: z.number(),
        name: z.string(),
        description: z.string(),
        dueDate: z.date(),
      })
    )
    .mutation(async (req) => {
      const { name, description, dueDate } = req.input;
      const projectID = Number(req.input.projectID);
      const project = await prisma.project.update({
        where: {
          projectID,
        },
        data: {
          name,
          dueDate,
          description,
        },
      });
      return project;
    }),
  deleteCourseProject: protectedProcedure
    .input(
      z.object({
        projectID: z.number(),
      })
    )
    .mutation(async (req) => {
      const projectID = Number(req.input.projectID);
      const project = await prisma.project.delete({
        where: {
          projectID,
        },
      });
      return project;
    }),
  getAllInstructorCourse: protectedProcedure.query(async (req) => {
    const { session } = req.ctx;
    const instructorID = Number(session.user.id);
    const result: CourseInfo[] = await prisma.$queryRaw(
      Prisma.sql`
        select c.courseID, c.name as courseName, c.location, u.name as instructorName, count(p.courseID) as numProjects, count(sc.courseID) as numEnrolled
        from course c
        left join Project p on c.courseID = p.courseID
        left join StudentCourse sc on sc.courseID = p.courseID
        left join user u on c.instructorID = u.userID
        where c.instructorID = ${instructorID}
        group by c.courseID;    `
    );
    return result;
  }),
  viewInstructorCourse: protectedProcedure
    .input(z.object({ courseID: z.number() }))
    .query(async (req) => {
      const { courseID } = req.input;
      const { session } = req.ctx;
      // changed sc.courseid = p.courseid to c.courseid
      const courseInfo: CourseInfo[] = await prisma.$queryRaw(
        Prisma.sql`
        select c.courseID, c.name as courseName, c.location, u.name as instructorName, count(p.courseID) as numProjects, count(sc.courseID) as numEnrolled
        from course c
        left join Project p on c.courseID = p.courseID
        left join StudentCourse sc on sc.courseID = c.courseID 
        left join user u on c.instructorID = u.userID
        where c.courseID = ${courseID}
        group by c.courseID;`
      );

      if (courseInfo.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not find class",
        });
      }

      const projects = await prisma.project.findMany({
        where: {
          courseID,
        },
      });

      const [course] = courseInfo;

      return { info: course, projects };
    }),
});
