export type Session = {
  id: string;
  status: "active" | "revoked";
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    permissions: number;
  };
  lastSeen: Date;
  createdAt: Date;
  refreshToken: string;
  tenants: {
    id: string;
    permissions: number;
    memberId: string;
  }[];
};