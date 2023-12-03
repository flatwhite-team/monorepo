import { Suspense } from "react";
import { View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

import { CenteredActivityIndicator } from "~/components/CenteredActivityIndicator";
import { useIsAppleAuthenticationAvailable } from "~/hooks/useIsAppleAuthenticationAvailable";
import { supabase } from "~/utils/supabase";

export function AuthScreen() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <Suspense fallback={<CenteredActivityIndicator size="large" />}>
        <Resolved />
      </Suspense>
    </View>
  );
}

function Resolved() {
  const { data: isAppleAuthAvailable } = useIsAppleAuthenticationAvailable();

  return isAppleAuthAvailable ? (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={4}
      className="h-12 w-64"
      onPress={async () => {
        try {
          const { authorizationCode, identityToken } =
            await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

          if (authorizationCode == null || identityToken == null) {
            throw new Error("authorizationCode and identityToken are required");
          }

          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "apple",
            token: identityToken,
          });

          console.log(JSON.stringify({ error, data }, null, 2));
        } catch (e: any) {
          if (e.code === "ERR_REQUEST_CANCELED") {
            // handle that the user canceled the sign-in flow
          } else {
            // handle other errors
          }
        }
      }}
    />
  ) : null;
}
