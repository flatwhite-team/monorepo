"use client";

import { api } from "~/utils/api";

export default function HomePage() {
  const { data } = api.store.findFirst.useQuery();
  console.log(data);

  return (
    <main className="flex h-screen flex-col items-center">
      <h1>Hi</h1>
    </main>
  );
}
