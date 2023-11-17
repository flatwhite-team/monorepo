import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

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
      initializeLocation: () => Promise<void>;
    }
  | undefined
>(undefined);

interface Props {
  children: ReactNode;
}

export function CustomLocationProvider({ children }: Props) {
  const queryClient = useQueryClient();
  const { data: currentLocation } = useCurrentLocation();
  const initialLocation =
    currentLocation?.coords == null
      ? {
          latitude: DEFAULT_COORDS.latitude,
          longitude: DEFAULT_COORDS.longitude,
        }
      : {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
  const [location, setLocation] = useState(initialLocation);

  async function initializeLocation() {
    await queryClient.refetchQueries(useCurrentLocation.queryKey);
    setLocation(initialLocation);
  }

  return (
    <CustomLocationContext.Provider
      value={{
        location,
        setLocation,
        initializeLocation,
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

  return context;
}
