import { Characteristic, DayOfWeek, Prisma } from "@flatwhite-team/prisma";
import type { BusinessDay, Image, Menu, Store } from "@flatwhite-team/prisma";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

const DEFAULT_TAKE = 10;

type ImageUrl = Pick<Image, "url">;
type MenuWithImages = Menu & { images: ImageUrl[] };

export type JoinedStore = Store & {
  menus: MenuWithImages[];
  businessDays: BusinessDay[];
  images: ImageUrl[];
  characteristics: Characteristic[];
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
        characteristics: true,
      },
    });
  }),
  findManagingByUserId: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.store.findMany({
        where: {
          managers: {
            some: {
              userId: input,
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });
    }),
  findInBox: publicProcedure
    .input(
      z.object({
        location: z.object({
          latitude: z.number(),
          longitude: z.number(),
          latitudeDelta: z.number(),
          longitudeDelta: z.number(),
        }),
        filters: z.array(z.array(z.nativeEnum(Characteristic))).optional(),
      }),
    )
    .query(({ ctx, input: { location, filters = [] } }) => {
      const { latitude, longitude, latitudeDelta, longitudeDelta } = location;
      const differenceFromLatitude = Math.min(latitudeDelta / 2, 0.028);
      const differenceFromLongitude = Math.min(longitudeDelta / 2, 0.025);

      return ctx.prisma.store
        .findMany({
          where: {
            latitude: {
              gte: latitude - differenceFromLatitude,
              lte: latitude + differenceFromLatitude,
            },
            longitude: {
              gte: longitude - differenceFromLongitude,
              lte: longitude + differenceFromLongitude,
            },
          },
          include: {
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
            images: {
              select: {
                url: true,
              },
            },
            characteristics: true,
          },
        })
        .then((result) => {
          const filterSets = filters
            .filter((filter) => {
              return filter.length > 0;
            })
            .map((filter) => {
              return new Set(filter);
            });

          return result
            .filter((store) => {
              for (const filterSet of filterSets) {
                if (
                  !store.characteristics.some(({ characteristic }) => {
                    return filterSet.has(characteristic);
                  })
                ) {
                  return false;
                }
              }

              return true;
            })
            .map((store) => {
              return {
                ...store,
                characteristics: store.characteristics.map(
                  ({ characteristic }) => {
                    return characteristic;
                  },
                ),
              };
            });
        });
    }),
  infiniteFindByDistance: publicProcedure
    .input(
      z.object({
        locationOptions: z.object({
          latitude: z.number(),
          longitude: z.number(),
          radius: z.number(),
        }),
        filters: z.array(z.array(z.nativeEnum(Characteristic))).optional(),
        take: z.number().optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const {
        locationOptions: { latitude, longitude, radius },
        filters = [],
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
      const _filters = filters.filter((filterGroup) => {
        return filterGroup.length > 0;
      });

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
          ) AS menus,
          COALESCE(
            (
              SELECT JSON_ARRAYAGG(StoreCharacteristic.characteristic)
              FROM StoreCharacteristic
              WHERE Store.id = StoreCharacteristic.storeId
            ),
            JSON_ARRAY()
          ) AS characteristics
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
        ${
          _filters.length > 0
            ? Prisma.raw(
                `AND ${_filters
                  .map((filterGroup) => {
                    const inClause = filterGroup.map((c) => `'${c}'`).join(",");

                    return `EXISTS (
                      SELECT 1 FROM StoreCharacteristic
                      WHERE Store.id = StoreCharacteristic.storeId
                      AND StoreCharacteristic.characteristic IN (${inClause})
                    )`;
                  })
                  .join(" AND ")}
              `,
              )
            : Prisma.empty
        }
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
        phoneNumber: z.string().nullable(),
        latitude: z.number(),
        longitude: z.number(),
        description: z.string().nullable(),
        menus: z.array(
          z.object({
            name: z.string(),
            price: z.number().nullable(),
            images: z.array(z.string()),
            description: z.string().nullable(),
          }),
        ),
        businessDays: z.array(
          z.object({
            dayOfWeek: z.nativeEnum(DayOfWeek),
            openTime: z.string().nullable(),
            closeTime: z.string().nullable(),
          }),
        ),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.store.create({
        data: {
          name: input.name,
          address: input.address,
          phoneNumber: input.phoneNumber,
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
