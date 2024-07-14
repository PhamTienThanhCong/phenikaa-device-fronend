import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getUserData } from "@/features/auth/authApi";
import { useEffect, useState } from "react";

export default function useLoadData() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((store) => store.auth.isLogin);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataUser = async () => {
      if (!isAuthenticated) {
        await dispatch(getUserData());
      }
      setLoading(false);
    };

    fetchDataUser();
  }, [isAuthenticated, dispatch]);

  return loading;
}
