import { $Enums } from "@flatwhite-team/prisma";
import type { BusinessDay, Image, Menu, Store } from "@flatwhite-team/prisma";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

const DEFAULT_TAKE = 10;

const locationOptionsSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  radius: z.number(),
});

type ImageUrl = Pick<Image, "url">;
type MenuWithImages = Menu & { images: ImageUrl[] };

export type JoinedStore = Store & {
  menus: MenuWithImages[];
  businessDays: BusinessDay[];
  images: ImageUrl[];
};

export const storeRouter = createTRPCRouter({
  findById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.store.findUniqueOrThrow({
      where: {
        id: input,
      },
      include: {
        images: {
          select: {
            url: true,
          },
        },
        menus: {
          include: {
            images: {
              select: {
                url: true,
              },
            },
          },
        },
        businessDays: true,
      },
    });
  }),
  infiniteFindByDistance: publicProcedure
    .input(
      z.object({
        locationOptions: locationOptionsSchema,
        take: z.number().optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const {
        locationOptions: { latitude, longitude, radius },
        take,
        cursor,
      } = input;
      const skip = cursor == null ? 0 : 1;
      const degreesPerKm = 1 / 111.32;
      const radiusInDegress = (radius / 1000) * degreesPerKm;
      const maxLat = latitude + radiusInDegress;
      const minLat = latitude - radiusInDegress;
      const maxLong =
        longitude + radiusInDegress / Math.cos(latitude * (Math.PI / 180));
      const minLong =
        longitude - radiusInDegress / Math.cos(latitude * (Math.PI / 180));

      return ctx.prisma.$queryRaw<JoinedStore[]>`
        SELECT 
          Store.*,
          COALESCE(
            (
              SELECT JSON_ARRAYAGG(JSON_OBJECT('url', Image.url))
              FROM Image
              WHERE Store.id = Image.storeId
            ),
            JSON_ARRAY()
          ) AS images,
          COALESCE(
            (
              SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'dayOfWeek', BusinessDay.dayOfWeek,
                  'openTime', BusinessDay.openTime,
                  'closeTime', BusinessDay.closeTime
                )
              )
              FROM BusinessDay
              WHERE Store.id = BusinessDay.storeId
            ),
            JSON_ARRAY()
          ) AS businessDays,
          COALESCE(
            (
              SELECT JSON_ARRAYAGG(JSON_OBJECT('name', Menu.name))
              FROM Menu
              WHERE Store.id = Menu.storeId
            ),
            JSON_ARRAY()
          ) AS menus
        FROM 
          Store
        WHERE 
          latitude BETWEEN ${minLat} AND ${maxLat} 
        AND 
          longitude BETWEEN ${minLong} AND ${maxLong}
        AND ST_Distance_Sphere(
            POINT(${longitude}, ${latitude}),
            POINT(longitude, latitude)
          ) <= ${radius}
        AND (
          ${cursor} IS NULL 
          OR 
            ${cursor} IS NOT NULL
            AND 
              ST_Distance_Sphere(
                POINT(${longitude}, ${latitude}),
                POINT(longitude, latitude)
              ) >= ST_Distance_Sphere(
                POINT(${longitude}, ${latitude}),
                POINT(
                  (SELECT longitude FROM Store WHERE id = ${cursor}),
                  (SELECT latitude FROM Store WHERE id = ${cursor})
                )
              )
        )
        GROUP BY
          Store.id
        ORDER BY
          ST_Distance_Sphere(
            POINT(${longitude}, ${latitude}), 
            POINT(longitude, latitude)
          ) ASC
        LIMIT
          ${skip}, ${take ?? DEFAULT_TAKE}
        ;
      `;
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        tel: z.string().optional(),
        latitude: z.number(),
        longitude: z.number(),
        description: z.string().optional(),
        menus: z.array(
          z.object({
            name: z.string(),
            price: z.number().optional(),
            images: z.array(z.string()),
            description: z.string().optional(),
          }),
        ),
        businessDays: z.array(
          z.object({
            dayOfWeek: z.nativeEnum($Enums.DayOfWeek),
            openTime: z.string(),
            closeTime: z.string(),
          }),
        ),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.store.create({
        data: {
          name: input.name,
          address: input.address,
          tel: input.tel,
          latitude: input.latitude,
          longitude: input.longitude,
          description: input.description,
          businessDays: {
            create: input.businessDays,
          },
          menus: {
            create: input.menus.map((menu) => {
              return {
                name: menu.name,
                price: menu.price,
                description: menu.description,
                images: {
                  create: menu.images.map((url) => {
                    return {
                      url,
                    };
                  }),
                },
              };
            }),
          },
        },
      });
    }),
});
