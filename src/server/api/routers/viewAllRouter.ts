import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const viewAllRouter = createTRPCRouter({
  getUser: publicProcedure.query(async (req) => {
    const users = await prisma.user.findMany();
    return users;
  }),
  getRole: publicProcedure.query(async (req) => {
    const role = await prisma.role.findMany();
    return role;
  }),
  getCourse: publicProcedure.query(async (req) => {
    const course = await prisma.course.findMany();
    return course;
  }),
  getProject: publicProcedure.query(async (req) => {
    const project = await prisma.project.findMany();
    return project;
  }),
  getStudentProject: publicProcedure.query(async (req) => {
    const studentProject = await prisma.studentProject.findMany();
    return studentProject;
  }),
  getStudentCourse: publicProcedure.query(async (req) => {
    const studentCourse = await prisma.studentCourse.findMany();
    return studentCourse;
  }),
});
