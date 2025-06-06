import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/applications");
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Logging you in...</div>;
};

export default AuthRedirect;
