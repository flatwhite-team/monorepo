import Toast, { ToastOptions } from "react-native-root-toast";

import { colors } from "~/constants";

export function showToast(message: string, options?: ToastOptions) {
  return Toast.show(message, {
    opacity: 0.7,
    backgroundColor: colors.gray900,
    hideOnPress: true,
    ...options,
  });
}
