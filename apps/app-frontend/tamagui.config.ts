import { config } from "@tamagui/config/v2-native";
import { createTamagui } from "tamagui";

const tamaguiConfig = createTamagui(config);

type TamaguiConfig = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends TamaguiConfig {}
}

export default tamaguiConfig;
