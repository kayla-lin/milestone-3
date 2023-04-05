import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/userRouter";
import { viewAllRouter } from "./routers/viewAllRouter";
import { studentRouter } from "./routers/studentRouter";
import { instructorRouter } from "./routers/instructorRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  viewAll: viewAllRouter,
  student: studentRouter,
  instructor: instructorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
