export const fetcher = async <T = unknown>(
  url: string,
  params?: Record<string, string | number>
): Promise<T> => {
  let finalUrl = url;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value.toString());
    });
    finalUrl = `${url}?${searchParams.toString()}`;
  }

  const response = await fetch(finalUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
};
