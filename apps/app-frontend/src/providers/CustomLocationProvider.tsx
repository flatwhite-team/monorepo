import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { DEFAULT_COORDS } from "~/constants";
import { useCurrentLocation } from "~/hooks/useCurrentLocation";

interface Location {
  latitude: number;
  longitude: number;
}

const CustomLocationContext = createContext<
  | {
      location: Location;
      setLocation: Dispatch<SetStateAction<Location>>;
    }
  | undefined
>(undefined);

interface Props {
  children: ReactNode;
}

export function CustomLocationProvider({ children }: Props) {
  const { data: currentLocation } = useCurrentLocation();
  const locationCoords =
    currentLocation?.coords == null
      ? {
          latitude: DEFAULT_COORDS.latitude,
          longitude: DEFAULT_COORDS.longitude,
        }
      : {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
  const [location, setLocation] = useState(locationCoords);

  return (
    <CustomLocationContext.Provider
      value={{
        location,
        setLocation,
      }}
    >
      {children}
    </CustomLocationContext.Provider>
  );
}

export function useCustomLocation() {
  const context = useContext(CustomLocationContext);

  if (context == null) {
    throw new Error("CustomLocationProvider를 사용하지 않았습니다.");
  }

  const { location, setLocation } = context;

  return {
    location,
    setLocation,
    setToDefault: () => {
      setLocation({
        latitude: DEFAULT_COORDS.latitude,
        longitude: DEFAULT_COORDS.longitude,
      });
    },
  };
}
