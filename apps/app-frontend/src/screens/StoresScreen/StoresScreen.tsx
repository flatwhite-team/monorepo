import { RefObject } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { JoinedStore } from "@flatwhite-team/trpc-server/src/router/store";
import { FlashList } from "@shopify/flash-list";

import { colors } from "~/constants";
import { StoresTabView } from "./StoresTabView";

interface Props {
  storeListRef: RefObject<FlashList<JoinedStore>>;
}

export function StoresScreen({ storeListRef }: Props) {
  const inset = useSafeAreaInsets();

  return (
    <View className="bg-background flex-1" style={{ paddingTop: inset.top }}>
      <StoresTabView storeListRef={storeListRef} />
    </View>
  );
}
