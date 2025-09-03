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
    Object.entries(query ?? {}).filter(([, value]) => value !== undefined && value !== null)
  )

  const search = query && Object.keys(query).length
    ? `?${new URLSearchParams(query).toString()}`
    : "";
  console.log(query);
  
  return `${path}${search}`;
}
