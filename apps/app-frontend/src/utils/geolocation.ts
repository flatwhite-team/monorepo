import * as Location from "expo-location";

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== Location.PermissionStatus.GRANTED) {
      console.error("Permission to access location was denied");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    return { lat: location.coords.latitude, long: location.coords.longitude };
  } catch (error) {
    console.error(JSON.stringify(error));
    return;
  }
};
