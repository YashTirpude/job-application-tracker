import { useEffect } from "react";

import { useDispatch } from "react-redux";
import {
  setUser,
  setToken,
  setLoading,
  logout,
} from "../store/slices/authSlice";
import api from "../services/api";

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      dispatch(setLoading(true));

      try {
        const res = await api.get("/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setUser(res.data.user));
        dispatch(setToken(token));
      } catch (err) {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useAuth;
