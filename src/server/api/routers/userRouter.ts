import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";
import { default as bcrypt } from "bcrypt";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        password: z.string(),
        email: z.string(),
        roleID: z.number(),
      })
    )
    .mutation(async (req) => {
      const { name, password, email, roleID } = req.input;
      const hashed = await bcrypt.hash(password, 10);
      try {
        const user = await prisma.user.create({
          data: {
            name: name,
            password: hashed,
            email: email,
            createdAt: new Date(),
            roleID: roleID,
          },
        });
        return user;
      } catch (err) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An an errored while adding your user",
          cause: err,
        });
      }
    }),
});
