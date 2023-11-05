"use client";

import { api } from "~/utils/api";
import { useAuthorizedSession } from "./_providers/AuthorizedSessionProvider";

export default function DashboardHome() {
  const { user } = useAuthorizedSession();
  const { data } = api.store.findManagingByUserId.useQuery(user.id);
  console.log(data);

  return <div>resolved</div>;
}
