import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const key = "bookmarked-store-ids";

function useGetLocalBookmarkedStoreIds() {
  return useQuery({
    queryKey: useGetLocalBookmarkedStoreIds.key,
    queryFn: async (): Promise<string[]> => {
      const item = await AsyncStorage.getItem(key);

      return item != null ? JSON.parse(item) : [];
    },
  });
}

useGetLocalBookmarkedStoreIds.key = ["local-bookmarks"];

function useAddLocalBookMarkedStoreId() {
  const queryClient = useQueryClient();
  const { data: bookmarks } = useGetLocalBookmarkedStoreIds();

  return useMutation({
    mutationFn: (storeId: string) => {
      const previousBookmarks = new Set(bookmarks ?? []);
      const newBookmarks = Array.from(previousBookmarks.add(storeId));

      return AsyncStorage.setItem(key, JSON.stringify(newBookmarks));
    },
    onSuccess: () => {
      return queryClient.invalidateQueries(useGetLocalBookmarkedStoreIds.key);
    },
  });
}

function useRemoveLocalBookMarkedStoreId() {
  const queryClient = useQueryClient();
  const { data: bookmarks } = useGetLocalBookmarkedStoreIds();

  return useMutation({
    mutationFn: (storeId: string) => {
      const bookmarksSet = new Set(bookmarks ?? []);
      bookmarksSet.delete(storeId);
      const newBookmarks = Array.from(bookmarksSet);

      return AsyncStorage.setItem(key, JSON.stringify(newBookmarks));
    },
    onSuccess: () => {
      return queryClient.invalidateQueries(useGetLocalBookmarkedStoreIds.key);
    },
  });
}

export function useLocalBookmarkedStoreIds() {
  const { data } = useGetLocalBookmarkedStoreIds();
  const { mutate: add } = useAddLocalBookMarkedStoreId();
  const { mutate: remove } = useRemoveLocalBookMarkedStoreId();

  function isBookmarked(storeId: string) {
    return data?.includes(storeId) ?? false;
  }

  return {
    data,
    add,
    remove,
    isBookmarked,
  };
}
