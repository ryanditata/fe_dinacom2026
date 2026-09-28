import useSWR, { mutate } from "swr";
import type { UserInfo } from "../types/user";
import { userService } from "../services/user/user-service";

export const useUserProfile = () => {
  const { data, error, isLoading } = useSWR<UserInfo>(
    "user-profile",
    async () => {
      const res = await userService.getUserProfile();
      if (!res.data)
        {
          throw new Error(res.meta.message || "Gagal mengambil data profil pengguna.");
        }
      
      return res.data;
    },
    {
      dedupingInterval: 60000,
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: data ?? null,
    loading: isLoading,
    error,
    mutateUser: () => mutate("user-profile"),
  };
};
