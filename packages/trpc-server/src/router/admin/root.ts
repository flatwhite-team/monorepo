import { z } from "zod";

import { createTRPCRouter, protectedAdminServerProcedure } from "../../trpc";

export const adminRouter = createTRPCRouter({
  test: protectedAdminServerProcedure.input(z.string()).query(({ ctx }) => {
    return ctx.session;
  }),
});
