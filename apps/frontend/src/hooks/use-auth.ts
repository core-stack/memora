import { AuthContext } from "@/context/auth";
import React from "react";

export const useAuth = () => {
  return React.useContext(AuthContext);
}