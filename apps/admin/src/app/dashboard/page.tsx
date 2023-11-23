"use client";

import assert from "assert";

import { api } from "~/utils/api";
import { useAuthorizedSession } from "../_providers/AuthorizedSessionProvider";

export default function DashboardHome() {
  const { user } = useAuthorizedSession();
  const { data: stores } = api.store.findManagingByUserId.useQuery(user.id);
  const { data } = api.store.infiniteFindByDistance.useQuery({
    locationOptions: {
      latitude: 37.505441,
      longitude: 127.036701,
      radius: 1000,
    },
    filters: [["HAND_DRIP"]],
  });
  console.log(data);

  assert(stores != null, "상점 정보가 없습니다.");

  return stores.map(({ id, name }) => {
    return (
      <div key={id}>
        <p>{name}</p>
        <button
          onClick={() => {
            console.log(id);
          }}
        >
          이동
        </button>
      </div>
    );
  });
}
