import { CallbackResponse, Provider } from "./types";

type Opts = {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  REDIRECT_URI: string;
};

export const GoogleProvider = ({ GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI }: Opts) => {
  const path = "google";
  return {
    path,
    getAuthUrl: (): string => {
      const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
      url.searchParams.set("redirect_uri", REDIRECT_URI);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "openid email profile");
      url.searchParams.set("prompt", "consent");
      return url.toString();
    },
    callback: async (code: string): Promise<CallbackResponse> => {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code"
        })
      });

      if (!tokenRes.ok) {
        throw new Error(`Erro ao obter token: ${tokenRes.statusText}`);
      }
      const { access_token } = (await tokenRes.json() as any);

      const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        }
      });

      if (!profileRes.ok) {
        throw new Error(`Erro ao obter token: ${profileRes.statusText}`);
      }
      const profile = (await profileRes.json() as any);

      return {
        providerAccountId: profile.sub,
        email: profile.email,
        name: profile.name,
        image: profile.picture,
        provider: path
      } as CallbackResponse;
    }
  } as Provider;
};
