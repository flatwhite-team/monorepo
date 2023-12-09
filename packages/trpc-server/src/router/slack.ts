import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const slackRouter = createTRPCRouter({
  sendNotibotMessage: publicProcedure
    .input(z.string())
    .mutation(({ input }) => {
      return fetch(
        "https://hooks.slack.com/services/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",
        {
          method: "POST",
          body: JSON.stringify({
            text: input,
          }),
        },
      );
    }),
});
