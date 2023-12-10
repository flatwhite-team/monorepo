import { ComponentProps } from "react";
import { TouchableHighlight, View } from "react-native";

import { colors } from "~/constants";

interface ListRowProps extends ComponentProps<typeof View> {
  onPress?: () => void;
}

export function ListRow({ onPress, ...props }: ListRowProps) {
  const className = "border-b border-gray-200 p-4";

  return onPress != null ? (
    <TouchableHighlight underlayColor={colors.gray100} onPress={onPress}>
      <View className={className} {...props} />
    </TouchableHighlight>
  ) : (
    <View className={className} {...props} />
  );
}
