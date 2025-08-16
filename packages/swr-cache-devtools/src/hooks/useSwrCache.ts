import { useState, useEffect, useMemo, useCallback } from "react";
import { useSWRConfig } from "swr";

export const useSwrCache = (isOpen: boolean) => {
  const [cacheKeys, setCacheKeys] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [refreshingKeys, setRefreshingKeys] = useState<Set<string>>(new Set());
  const [isRefreshingAll, setIsRefreshingAll] = useState<boolean>(false);
  const { cache, mutate } = useSWRConfig();

  // Get cache keys list
  useEffect(() => {
    const keys = Array.from(cache.keys());
    setCacheKeys(keys);
  }, [cache, isOpen]);

  // Filter cache keys based on search term
  const filteredCacheKeys = useMemo(
    () =>
      cacheKeys.filter((key) =>
        key.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [cacheKeys, searchTerm]
  );

  // Get data for selected key
  const getSelectedKeyData = useCallback(() => {
    if (!selectedKey) return null;
    return cache.get(selectedKey);
  }, [selectedKey, cache]);

  // Check if the selected key has an error
  const hasError = useCallback(() => {
    const cacheData = getSelectedKeyData();
    return cacheData && cacheData.error;
  }, [getSelectedKeyData]);

  // Get display data (success: data content, error: error content)
  const getDisplayData = useCallback(() => {
    const cacheData = getSelectedKeyData();
    if (!cacheData) return null;

    // If there's an error, return the error
    if (cacheData.error) {
      return cacheData.error;
    }

    // If successful, return only the data content
    if (cacheData.data) {
      return cacheData.data;
    }

    // Fallback to the entire cache data
    return cacheData;
  }, [getSelectedKeyData]);

  // Delete cache
  const deleteCache = useCallback(
    (key: string) => {
      cache.delete(key);
      setCacheKeys(Array.from(cache.keys()));
      if (selectedKey === key) {
        setSelectedKey(null);
      }
    },
    [cache, selectedKey]
  );

  // Manually refresh cache
  const refreshCache = useCallback(
    async (key: string) => {
      try {
        setRefreshingKeys((prev) => new Set(prev).add(key));

        await mutate(key);

        if (selectedKey === key) {
          setCacheKeys(Array.from(cache.keys()));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Cache refresh failed:", error);
      } finally {
        setRefreshingKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    },
    [mutate, selectedKey, cache]
  );

  // Handle key selection
  const handleKeySelection = useCallback((key: string) => {
    setSelectedKey(key);
  }, []);

  // Refresh all cache keys list
  const refreshCacheList = useCallback(async () => {
    try {
      setIsRefreshingAll(true);

      // Force update cache keys list from the Map
      const keys = Array.from(cache.keys());
      setCacheKeys(keys);

      // Small delay to show the refreshing state
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Cache list refresh failed:", error);
    } finally {
      setIsRefreshingAll(false);
    }
  }, [cache]);

  return {
    cacheKeys,
    filteredCacheKeys,
    selectedKey,
    searchTerm,
    refreshingKeys,
    isRefreshingAll,
    setSearchTerm,
    getSelectedKeyData,
    getDisplayData,
    hasError,
    deleteCache,
    refreshCache,
    refreshCacheList,
    handleKeySelection,
    mutate,
  };
};
