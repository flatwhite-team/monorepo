"use client";

import { useState } from "react";
import { $Enums } from "@flatwhite-team/prisma";
import { useFieldArray, useForm } from "react-hook-form";

import { api } from "~/utils/api";

interface Inputs {
  name: string;
  address: string;
  tel?: string;
  latitude: number;
  longitude: number;
  description?: string;
  businessDays: {
    dayOfWeek: $Enums.DayOfWeek;
    openTime: string;
    closeTime: string;
  }[];
  menus: {
    name: string;
    description?: string;
    price?: number;
    imageUrl: string;
  }[];
}

export default function NewStorePage() {
  const [done, setDone] = useState(false);
  const { mutate: createStore } = api.store.create.useMutation();
  const { register, handleSubmit, control } = useForm<Inputs>();
  const { fields: businessDayFields, append: appendBusinessDay } =
    useFieldArray({
      control,
      name: "businessDays",
    });
  const { fields: menuFields, append: appendMenu } = useFieldArray({
    control,
    name: "menus",
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((fields) => {
        if (!done) {
          return;
        }

        createStore({
          name: fields.name,
          address: fields.address,
          tel: fields.tel,
          latitude: fields.latitude,
          longitude: fields.longitude,
          description: fields.description,
          businessDays: fields.businessDays,
          menus: fields.menus.map((menuField) => {
            return {
              name: menuField.name,
              price: menuField.price,
              description: menuField.description,
              images: [menuField.imageUrl],
            };
          }),
        });
      })}
    >
      <div className="flex gap-4">
        <label htmlFor="name">name</label>
        <input
          className="border"
          type="text"
          placeholder="name"
          {...register("name")}
        />
      </div>
      <div className="flex gap-4">
        <label htmlFor="description">description</label>
        <input
          className="border"
          type="text"
          placeholder="description"
          {...register("description")}
        />
      </div>
      <div className="flex gap-4">
        <label htmlFor="address">address</label>
        <input
          className="border"
          type="text"
          placeholder="address"
          {...register("address")}
        />
      </div>
      <div className="flex gap-4">
        <label htmlFor="tel">tel</label>
        <input
          className="border"
          type="text"
          placeholder="tel"
          {...register("tel")}
        />
      </div>
      <div className="flex gap-4">
        <label htmlFor="latitude">latitude</label>
        <input
          className="border"
          type="text"
          placeholder="latitude"
          {...register("latitude", { valueAsNumber: true })}
        />
      </div>
      <div className="flex gap-4">
        <label htmlFor="longitude">longitude</label>
        <input
          className="border"
          type="text"
          placeholder="longitude"
          {...register("longitude", { valueAsNumber: true })}
        />
      </div>
      {businessDayFields.map((businessDayField, index) => {
        return (
          <div key={businessDayField.id}>
            <select {...register(`businessDays.${index}.dayOfWeek`)}>
              {Object.values($Enums.DayOfWeek).map((dayOfWeek) => {
                return (
                  <option key={dayOfWeek} value={dayOfWeek}>
                    {dayOfWeek}
                  </option>
                );
              })}
            </select>
            <input
              className="border"
              type="text"
              {...register(`businessDays.${index}.openTime`)}
            />
            <input
              className="border"
              type="text"
              {...register(`businessDays.${index}.closeTime`)}
            />
          </div>
        );
      })}
      <button
        onClick={() => {
          appendBusinessDay({
            dayOfWeek: $Enums.DayOfWeek.EVERYDAY,
            openTime: "00:00",
            closeTime: "00:00",
          });
        }}
      >
        영업일 추가
      </button>
      {menuFields.map((menuField, index) => {
        return (
          <div key={menuField.id}>
            <input
              className="border"
              type="text"
              placeholder="name"
              {...register(`menus.${index}.name`)}
            />
            <input
              className="border"
              type="text"
              placeholder="description"
              {...register(`menus.${index}.description`)}
            />
            <input
              className="border"
              type="number"
              placeholder="price"
              {...register(`menus.${index}.price`, { valueAsNumber: true })}
            />
            <input
              className="border"
              type="text"
              placeholder="imageUrl"
              {...register(`menus.${index}.imageUrl`)}
            />
          </div>
        );
      })}
      <button
        onClick={() => {
          appendMenu({
            name: "",
            description: "",
            price: 0,
            imageUrl: "",
          });
        }}
      >
        메뉴 추가
      </button>
      <input
        type="checkbox"
        checked={done}
        onClick={() => {
          setDone(!done);
        }}
      />
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}
