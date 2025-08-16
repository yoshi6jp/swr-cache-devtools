import { useState, useEffect } from "react";
import { useSWRConfig } from "swr";

export const useSwrCache = (isOpen: boolean) => {
  const [cacheKeys, setCacheKeys] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { cache, mutate } = useSWRConfig();

  // Get cache keys list
  useEffect(() => {
    const keys = Array.from(cache.keys());
    setCacheKeys(keys);
  }, [cache, isOpen]);

  // Filter cache keys based on search term
  const filteredCacheKeys = cacheKeys.filter((key) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get data for selected key
  const getSelectedKeyData = () => {
    if (!selectedKey) return null;
    return cache.get(selectedKey);
  };

  // Get display data (success: data content, error: error content)
  const getDisplayData = () => {
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
  };

  // Delete cache
  const deleteCache = (key: string) => {
    cache.delete(key);
    setCacheKeys(Array.from(cache.keys()));
    if (selectedKey === key) {
      setSelectedKey(null);
    }
  };

  // Manually refresh cache
  const refreshCache = (key: string) => {
    mutate(key);
  };

  // Handle key selection
  const handleKeySelection = (key: string) => {
    setSelectedKey(key);
  };

  return {
    cacheKeys,
    filteredCacheKeys,
    selectedKey,
    searchTerm,
    setSearchTerm,
    getSelectedKeyData,
    getDisplayData,
    deleteCache,
    refreshCache,
    handleKeySelection,
    mutate,
  };
};
