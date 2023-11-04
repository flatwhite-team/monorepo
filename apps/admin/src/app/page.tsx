"use client";

import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 8);

// TODO(@Jaehoo-dev): internal 서비스로 옮기기
export default function HomePage() {
  return (
    <>
      <p>Upload a .png or .jpg image (max 1MB).</p>
      <input
        onChange={async (e) => {
          const s3Url = await uploadImage(e);

          await navigator.clipboard.writeText(s3Url);
          alert(`s3 url copied to clipboard. Save in database.`);
          console.log(s3Url);
        }}
        type="file"
        accept="image/png, image/jpeg"
      />
    </>
  );
}

const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]!;
  const objectKey = `${nanoid()}-${Date.now()}`;
  const fileType = encodeURIComponent(file.type);

  const res = await fetch(
    `/api/upload-url?key=${objectKey}&fileType=${fileType}`,
  );
  const { url, fields } = await res.json();

  const formData = new FormData();

  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  await fetch(url, {
    method: "POST",
    body: formData,
  });

  return `${url}${fields.key}`;
};
