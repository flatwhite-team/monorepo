import { ComponentProps, ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { XStack } from "tamagui";

interface BadgeProps extends ComponentProps<typeof Pressable> {
  active?: boolean;
  icon?: ReactNode;
  label?: string;
  size?: "small" | "medium" | "large";
}

export function Badge({
  active,
  icon,
  label,
  size = "medium",
  ...props
}: BadgeProps) {
  const paddingClassName =
    size === "small"
      ? "px-2.5 py-0.5"
      : size === "large"
      ? "px-3.5 py-1.5"
      : "px-3 py-1";

  return (
    <Pressable {...props}>
      <XStack
        className={`bg-background rounded-full border ${paddingClassName} ${
          active ? "border-primary" : "border-gray-300"
        }`}
      >
        {icon != null ? icon : null}
        {label != null ? (
          <Text
            className={`${size === "small" ? "text-xs" : "text-sm"} ${
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
