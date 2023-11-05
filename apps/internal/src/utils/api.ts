import type { AppRouter } from "@flatwhite-team/trpc-server";
import { createTRPCReact } from "@trpc/react-query";

export const api = createTRPCReact<AppRouter>();

export {
  type RouterInputs,
  type RouterOutputs,
} from "@flatwhite-team/trpc-server";
