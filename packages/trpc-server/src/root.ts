import { menuRouter } from "./router/menu";
import { slackRouter } from "./router/slack";
import { storeRouter } from "./router/store";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  store: storeRouter,
  menu: menuRouter,
  slack: slackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
