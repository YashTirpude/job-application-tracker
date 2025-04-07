import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/applications");
    } else {
      console.error("No token found in redirect URL");
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return <div>Logging in...</div>;
};

export default AuthRedirect;
