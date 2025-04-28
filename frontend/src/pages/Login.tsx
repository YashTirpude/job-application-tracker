import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import AuthForm from "../components/AuthForm";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      toast.success("Login successful!");
      navigate("/applications");
    }
  }, [params, navigate]);

  return (
    <>
      <AuthForm type="login" />
    </>
  );
};

export default Login;
