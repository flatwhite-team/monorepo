import type { ReactNode } from "react";
import { headers } from "next/headers";

// import { TRPCReactProvider } from "./_providers/TRPCReactProvider";
import { AuthorizedOnly } from "./_components/AuthorizedOnly";
import { TRPCReactProvider } from "./_providers/TRPCReactProvider";

interface Props {
  children: ReactNode;
}

/**
 * Since we're passing `headers()` to the `TRPCReactProvider` we need to
 * make the entire app dynamic. You can move the `TRPCReactProvider` further
 * down the tree (e.g. /dashboard and onwards) to make part of the app statically rendered.
 */
export const dynamic = "force-dynamic";

export default function Layout({ children }: Props) {
  return (
    <TRPCReactProvider headers={headers()}>
      <AuthorizedOnly>{children}</AuthorizedOnly>
    </TRPCReactProvider>
  );
}
