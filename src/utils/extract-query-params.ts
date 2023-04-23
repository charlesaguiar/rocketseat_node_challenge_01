export function extractQueryParams(query: string) {
  if (!query) return {};

  return query
    .substring(1)
    .split("&")
    .reduce((params: Record<string, string>, item) => {
      const [key, value] = item.split("=");
      params[key] = value;
      return params;
    }, {});
}
