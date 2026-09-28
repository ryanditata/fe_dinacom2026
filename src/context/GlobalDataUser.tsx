
import React, { createContext, useContext } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { Navigate } from "react-router-dom";

type GlobalDataContextType = {
  user: ReturnType<typeof useUserProfile>;
};

const GlobalDataUserContext = createContext<GlobalDataContextType | null>(null);

export const GlobalDataUserProvider = ({ children }: { children: React.ReactNode }) => {
    const user = useUserProfile();

    if (!user.data?.name || !user.data?.email || !user.data?.url_ktm || !user.data?.phone || !user.data?.url_twibbon || !user.data?.education_level || !user.data?.institution || !user.data?.url_proof_follow_instagram_dncc || !user.data?.url_proof_follow_instagram_dinacom) {
        return <Navigate to={'/complete-profile'} />
      }

  return (
    <GlobalDataUserContext.Provider value={{ user }}>
      {children}
    </GlobalDataUserContext.Provider>
  );
};

export const useDataUser = () => {
  const ctx = useContext(GlobalDataUserContext);
  if (!ctx) {
    throw new Error("useDataUser must be used within GlobalDataProvider");
  }
  return ctx;
};
