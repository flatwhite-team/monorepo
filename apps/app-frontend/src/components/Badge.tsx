import { ComponentProps, ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { XStack } from "tamagui";

interface BadgeProps extends ComponentProps<typeof Pressable> {
  active?: boolean;
  icon?: ReactNode;
  label?: string;
}

export function Badge({ active, icon, label, ...props }: BadgeProps) {
  return (
    <Pressable {...props}>
      <XStack
        className={`bg-background rounded-full border px-3 py-1 ${
          active ? "border-primary" : "border-gray-300"
        }`}
      >
        {icon != null ? icon : null}
        {label != null ? (
          <Text
            className={`text-sm ${
              active ? "text-primary font-bold" : "font-medium text-gray-700"
            }`}
          >
            {label}
          </Text>
        ) : null}
      </XStack>
    </Pressable>
  );
}
