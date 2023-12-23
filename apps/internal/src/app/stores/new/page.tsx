"use client";

import { useState } from "react";
import { Characteristic, DayOfWeek } from "@flatwhite-team/prisma";
import { useFieldArray, useForm } from "react-hook-form";

import { api } from "~/utils/api";

interface Inputs {
  name: string;
  address: string;
  phoneNumber: string | null;
  latitude: number;
  longitude: number;
  description: string | null;
  images: {
    url: string;
  }[];
  businessDays: {
    dayOfWeek: DayOfWeek;
    openTime: string;
    closeTime: string;
  }[];
  menus: {
    name: string;
    description: string | null;
    price: number | null;
    imageUrl: string;
  }[];
  characteristics: {
    value: Characteristic;
  }[];
}

export default function NewStorePage() {
  const [done, setDone] = useState(false);
  const { mutate: createStore } = api.store.create.useMutation();
  const { register, handleSubmit, control } = useForm<Inputs>();
  const {
    fields: businessDayFields,
    append: appendBusinessDay,
    remove: removeBusinessDay,
  } = useFieldArray({
    control,
    name: "businessDays",
  });
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
  });
  const {
    fields: menuFields,
    append: appendMenu,
    remove: removeMenu,
  } = useFieldArray({
    control,
    name: "menus",
  });
  const {
    fields: characteristicFields,
    append: appendCharacteristic,
    remove: removeCharacteristic,
  } = useFieldArray({
    control,
    name: "characteristics",
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
          phoneNumber: fields.phoneNumber,
          latitude: fields.latitude,
          longitude: fields.longitude,
          description: fields.description,
          images: fields.images,
          businessDays: fields.businessDays,
          menus: fields.menus.map((menuField) => {
            return {
              name: menuField.name,
              price: menuField.price,
              description: menuField.description,
              images: [menuField.imageUrl],
            };
          }),
          characteristics: fields.characteristics.map(({ value }) => {
            return value;
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
          {...register("name", { required: true })}
        />
      </div>
      <div className="flex gap-4">
        <label htmlFor="description">description</label>
        <input
          className="border"
          type="text"
          placeholder="description"
          {...register("description", {
            required: false,
            setValueAs: (value) => {
              return value === "" ? null : value;
            },
          })}
        />
      </div>
      <div className="flex gap-4">
        <label htmlFor="address">address</label>
        <input
          className="border"
          type="text"
          placeholder="address"
          {...register("address", { required: true })}
        />
      </div>
      <div className="flex gap-4">
        <label htmlFor="phoneNumber">phoneNumber</label>
        <input
          className="border"
          type="text"
          placeholder="phoneNumber"
          {...register("phoneNumber", {
            required: false,
            setValueAs: (value) => {
              return value === "" ? null : value;
            },
          })}
        />
      </div>
      <div className="flex gap-4">
        <label htmlFor="latitude">latitude</label>
        <input
          className="border"
          type="text"
          placeholder="latitude"
          {...register("latitude", { required: true, valueAsNumber: true })}
        />
      </div>
      <div className="flex gap-4">
        <label htmlFor="longitude">longitude</label>
        <input
          className="border"
          type="text"
          placeholder="longitude"
          {...register("longitude", { required: true, valueAsNumber: true })}
        />
      </div>
      {businessDayFields.map((businessDayField, index) => {
        return (
          <div key={businessDayField.id}>
            <select
              {...register(`businessDays.${index}.dayOfWeek`, {
                required: true,
              })}
            >
              {Object.values(DayOfWeek).map((dayOfWeek) => {
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
            <button
              onClick={() => {
                removeBusinessDay(index);
              }}
            >
              영업일 삭제
            </button>
          </div>
        );
      })}
      <button
        onClick={() => {
          appendBusinessDay({
            dayOfWeek: DayOfWeek.EVERYDAY,
            openTime: "",
            closeTime: "",
          });
        }}
      >
        영업일 추가
      </button>
      {imageFields.map((imageField, index) => {
        return (
          <div key={imageField.id}>
            <input
              className="border"
              type="text"
              placeholder="imageUrl"
              {...register(`images.${index}.url`, {
                required: true,
                setValueAs: (value) => {
                  return value === "" ? null : value;
                },
              })}
            />
            <button
              onClick={() => {
                removeImage(index);
              }}
            >
              이미지 삭제
            </button>
          </div>
        );
      })}
      <button
        onClick={() => {
          appendImage({
            url: "",
          });
        }}
      >
        이미지 추가
      </button>
      {menuFields.map((menuField, index) => {
        return (
          <div key={menuField.id}>
            <input
              className="border"
              type="text"
              placeholder="name"
              {...register(`menus.${index}.name`, { required: true })}
            />
            <input
              className="border"
              type="text"
              placeholder="description"
              {...register(`menus.${index}.description`, {
                required: false,
                setValueAs: (value) => {
                  return value === "" ? null : value;
                },
              })}
            />
            <input
              className="border"
              type="number"
              placeholder="price"
              {...register(`menus.${index}.price`, {
                required: false,
                setValueAs: (value) => {
                  if (value === 0 || value === "") {
                    return null;
                  }

                  return Number(value);
                },
              })}
            />
            <input
              className="border"
              type="text"
              placeholder="imageUrl"
              {...register(`menus.${index}.imageUrl`, {
                required: true,
                setValueAs: (value) => {
                  return value === "" ? null : value;
                },
              })}
            />
            <button
              onClick={() => {
                removeMenu(index);
              }}
            >
              메뉴 삭제
            </button>
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
      {characteristicFields.map((characteristicField, index) => {
        return (
          <div key={characteristicField.id}>
            <select
              {...register(`characteristics.${index}.value`, {
                required: true,
              })}
            >
              {Object.values(Characteristic).map((characteristic) => {
                return (
                  <option key={characteristic} value={characteristic}>
                    {characteristic}
                  </option>
                );
              })}
            </select>
            <button
              onClick={() => {
                removeCharacteristic(index);
              }}
            >
              특징 삭제
            </button>
          </div>
        );
      })}
      <button
        onClick={() => {
          appendCharacteristic({
            value: Characteristic.WIFI,
          });
        }}
      >
        특징 추가
      </button>
      <input
        type="checkbox"
        defaultChecked={done}
        onChange={() => {
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
