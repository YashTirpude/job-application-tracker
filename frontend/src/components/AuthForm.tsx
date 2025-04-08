import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";

import axios from "axios";

interface AuthFormProps {
  type: "login" | "register";
}

type FormValues = {
  email: string;
  password: string;
  displayName?: string;
};

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    const endpoint =
      type === "login"
        ? "http://localhost:5000/auth/login"
        : "http://localhost:5000/auth/register";

    try {
      const res = await axios.post(endpoint, data, { withCredentials: true });
      localStorage.setItem("token", res.data.token);
      dispatch(setUser(res.data.user)); // 👈 Add this line!
      navigate("/applications");
    } catch (err: any) {
      alert(err.response?.data?.message || "Auth failed.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-lg p-6 max-w-md mx-auto mt-24 rounded-xl space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">
        {type === "login" ? "Login" : "Register"}
      </h2>

      {type === "register" && (
        <>
          <input
            type="text"
            placeholder="Display Name"
            className="input input-bordered w-full"
            {...register("displayName", {
              required: "Display name is required",
            })}
          />
          {errors.displayName && (
            <p className="text-sm text-red-600">{errors.displayName.message}</p>
          )}
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        className="input input-bordered w-full"
        {...register("email", { required: "Email is required" })}
      />
      {errors.email && (
        <p className="text-sm text-red-600">{errors.email.message}</p>
      )}

      <input
        type="password"
        placeholder="Password"
        className="input input-bordered w-full"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Minimum 6 characters",
          },
        })}
      />
      {errors.password && (
        <p className="text-sm text-red-600">{errors.password.message}</p>
      )}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? type === "login"
            ? "Logging in..."
            : "Registering..."
          : type === "login"
          ? "Login"
          : "Register"}
      </button>

      <div className="divider">or</div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="btn btn-outline w-full"
      >
        Continue with Google
      </button>
    </form>
  );
};

export default AuthForm;
