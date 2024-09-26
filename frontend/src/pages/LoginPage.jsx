import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { setCredentials } from "@/store";
import FormContainer from "@/components/FormContainer";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutateAsync: login, isLoading } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data) => {
      try {
        const res = await axios.post("/api/users/login", data);
        return res.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
    },
  });

  const { userInfo } = useSelector((state) => state.auth);

  const search = useLocation();
  const sp = new URLSearchParams(search.search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [redirect, userInfo, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <FormContainer>
      <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full py-2 px-4 text-white font-bold rounded-lg"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-indigo-600 hover:underline"
            >
              Sign up here
            </Link>
          </div>
        </form>
      </div>
    </FormContainer>
  );
};

export default LoginPage;
