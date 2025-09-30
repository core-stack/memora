export function buildUrl(
  path: string,
  params?: Record<string, any>,
  query?: Record<string, any>
) {

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(
        new RegExp(`[:\\[]${key}\\]?`, "g"),
        encodeURIComponent(String(value))
      );
    }
  }

  query = Object.fromEntries(
    Object.entries(query ?? {}).filter(([, value]) => value !== undefined)
  )
  
  let search = "";
  if (query) {
    search = `?`;
    search += Object.entries(query).map(([key, value]) => {
      if (key === "limit" || key === "offset") {
        return `${key}=${value}`;
      }
      if (key === "order") {
        return "sort=" + Object.entries(value)
          .map(([orderKey, orderValue]) => `${orderValue === "ASC" ? "" : "-"}${orderKey}`)
          .join(",");
      }
      if (key === "filter") {
        return Object.entries(value)
          .map(([filterKey, filterValue]) => filterValue !== undefined ? `filter[${filterKey}]=${filterValue}`: undefined)
          .filter(Boolean)
          .join("&");
      }
      return `${key}=${value}`;
    }).join("&");
  }  
  return `${path}${search}`;
}
