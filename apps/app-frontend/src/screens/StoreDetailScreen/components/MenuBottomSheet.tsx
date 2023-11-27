import { forwardRef, useEffect, useRef } from "react";
import { Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Image } from "expo-image";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, YStack } from "tamagui";

import { colors } from "~/constants";
import {
  StoreDetailScreenNavigationProp,
  StoreDetailScreenRouteProp,
} from "~/navigation/HomeStackNavigator";
import { api } from "~/utils/api";

export const MenuBottomSheet = forwardRef<BottomSheetMethods>(
  function MenuBottomSheet(props, ref) {
    const _ref = useRef<BottomSheetMethods | null>(null);
    const navigation = useNavigation<StoreDetailScreenNavigationProp>();
    const {
      params: { storeId, selectedMenuId },
    } = useRoute<StoreDetailScreenRouteProp>();
    const { data: menus } = api.menu.findByStoreId.useQuery(storeId);
    const selectedMenu = menus?.find((menu) => {
      return menu.id === selectedMenuId;
    });
    const snapPoints = ["80%"];

    useEffect(() => {
      if (selectedMenu != null) {
        _ref?.current?.expand();
      } else {
        _ref?.current?.close();
      }
    }, [selectedMenu, _ref?.current]);

    return (
      <BottomSheet
        ref={(node) => {
          _ref.current = node;

          if (ref == null) {
            return;
          }

          if (typeof ref === "function") {
            ref(node);
          } else {
            ref.current = node;
          }
        }}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
        handleStyle={{
          backgroundColor: colors.background,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.gray400,
        }}
        backdropComponent={(backdropProps) => {
          return (
            <BottomSheetBackdrop
              {...backdropProps}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              pressBehavior="close"
            />
          );
        }}
        onChange={(index) => {
          if (index === -1) {
            navigation.setParams({
              selectedMenuId: undefined,
            });
          }
        }}
        {...props}
      >
        {selectedMenu != null ? (
          <ScrollView
            className="bg-background flex-1"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {selectedMenu.images.length > 0 ? (
              <Image
                className="h-64 w-full"
                source={{
                  uri: selectedMenu.images[0].url,
                }}
              />
            ) : null}
            <YStack className="p-5" gap={16}>
              <Text className="text-2xl font-semibold text-gray-900">
                {selectedMenu.name}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">
                  가격
                </Text>
                {selectedMenu.price != null ? (
                  <View className="flex-row items-center">
                    <Text className="text-primary text-xl font-bold">{`${selectedMenu.price.toLocaleString()}`}</Text>
                    <Text className="text-primary text-xl font-semibold">
                      원
                    </Text>
                  </View>
                ) : (
                  <Text className="text-lg font-semibold text-gray-900">
                    가게 문의
                  </Text>
                )}
              </View>
              <Text className="text-base text-gray-700">
                {selectedMenu.description}
              </Text>
            </YStack>
          </ScrollView>
        ) : null}
      </BottomSheet>
    );
  },
);
