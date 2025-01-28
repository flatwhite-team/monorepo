import { adminRouter } from "./router/admin/root";
import { menuRouter } from "./router/menu";
import { storeRouter } from "./router/store";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  store: storeRouter,
  menu: menuRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
