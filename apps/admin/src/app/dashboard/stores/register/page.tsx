"use client";

import { useForm } from "react-hook-form";

import { useAuthorizedSession } from "~/app/_providers/AuthorizedSessionProvider";
import { sendSlackNotibotMessage } from "~/utils/sendSlackNotiBotMessage";

interface Form {
  name: string;
  address: string;
}

// 카페 이름과 주소를 제출하면 카페 등록하고 관리자로 설정
// 어드민 기본 페이지에서 관리자로 설정된 매장 없으면 여기로 이동
export default function RegisterPage() {
  const { user } = useAuthorizedSession();
  const { register, handleSubmit } = useForm<Form>();

  return (
    <div className="flex flex-col items-center p-9">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold">카페 등록</h1>
        <p className="text-sm text-gray-500">
          카페 이름과 주소를 입력해주세요.
          <br />
          24시간 안에 카페 등록 후 관리자로 설정해 드립니다.
          <br />
          카페 관리자는 앱에 노출하는 설명과 메뉴 등을 설정할 수 있습니다.
        </p>
        <form
          onSubmit={handleSubmit(async (fields) => {
            await sendSlackNotibotMessage(
              `[카페 등록 요청]\nid: ${user.id}\nemail: ${user.email}\n카페 이름: ${fields.name}\n카페 주소: ${fields.address}`,
            );
          })}
        >
          <div className="space-y-3">
            <div className="space-y-0.5">
              <label htmlFor="name" className="text-md">
                카페 이름
              </label>
              <input
                className="focus:ring-1.5 block w-full rounded border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500"
                type="text"
                id="name"
                autoComplete="off"
                {...register("name", { required: true })}
              />
            </div>
            <div className="space-y-0.5">
              <label htmlFor="address" className="text-md">
                주소
              </label>
              <input
                className="focus:ring-1.5 block w-full rounded border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500"
                type="text"
                id="address"
                autoComplete="off"
                {...register("address", { required: true })}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="w-full rounded bg-blue-500 px-4 py-2 text-white"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
