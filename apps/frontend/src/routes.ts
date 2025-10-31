export const REDIRECT_WHEN_NOT_AUTHENTICATED_PATH = "/auth/login";

export const publicRoutes = [
  { path: '/auth/login', whenAuthenticated: "redirect" },
  { path: '/auth/create-account', whenAuthenticated: "redirect" },
  { path: '/auth/activate', whenAuthenticated: "redirect" },
  { path: '/pricing', whenAuthenticated: "next" },
  { path: '/terms', whenAuthenticated: "next" },
  { path: '/privacy', whenAuthenticated: "next" },
] as const
