export function buildUrl(
  path: string,
  params?: Record<string, any>,
  query?: Record<string, any>
) {
  const match = path.match(/\]\s+(.+)$/);
  let finalPath = match ? match[1] : "";

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      finalPath = finalPath.replace(
        new RegExp(`[:\\[]${key}\\]?`, "g"),
        encodeURIComponent(String(value))
      );
    }
  }

  query = Object.fromEntries(
    Object.entries(query ?? {}).filter(([, value]) => value !== undefined && value !== null)
  )

  const search = query
    ? `?${new URLSearchParams(query).toString()}`
    : "";

  return `${finalPath}${search}`;
}
