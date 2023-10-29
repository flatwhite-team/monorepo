import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const menuRouter = createTRPCRouter({
  findByStoreId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.menu.findMany({
      where: {
        storeId: input,
      },
      include: {
        images: {
          select: {
            url: true,
          },
        },
      },
    });
  }),
});
