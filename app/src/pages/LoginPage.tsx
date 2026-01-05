import { useContext, useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faArrowRightToBracket,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import apiClient from "../helpers/apiClient";
import { UserContext } from "@/hooks/UserContext";
import type { TUser } from "@/types/TUser";

interface LoginPageResponse {
  message: string;
}

const LoginPage = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  // On mount: log out any existing user
  useEffect(() => {
    userContext.setCurrUserUndefined();
  }, [userContext]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.post<LoginPageResponse, { email: string; password: string }>(
        "auth/login",
        { email, password }
      );

      if (!response.data || response.data.message !== "Logged in successfully") {
        setErrorMessage("Login failed: invalid credentials or server error");
        console.error("Login response invalid:", response.data);
        return;
      }

      // Fetch the user immediately from /auth/me
      const user: TUser | undefined = await userContext.getCurrUserAsync();

      if (!user) {
        setErrorMessage("Failed to retrieve user after login");
        return;
      }

      // Navigate to home immediately
      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMessage(err.message);
      else setErrorMessage("Login failed due to unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex p-8 bg-background">
      {/* Left */}
      <div className="w-1/2 flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col w-2/3 xl:w-2/5 gap-10 justify-center">
          <h1 className="text-5xl font-semibold">Login</h1>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col gap-4">
              <div className="relative w-full">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-primary p-4 pl-10 rounded-md shadow-sm w-full focus:outline-none"
                  required
                />
              </div>

              <div className="relative w-full">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={viewPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-primary p-4 pl-10 rounded-md shadow-sm w-full focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setViewPassword(!viewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={viewPassword ? faEyeSlash : faEye}
                    className="text-gray-400"
                  />
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-4 bg-accent shadow-md text-lg py-3 px-4 my-4 rounded-md w-full select-none disabled:opacity-60"
            >
              <FontAwesomeIcon
                icon={faArrowRightToBracket}
                className="text-primary"
              />
              <span className="text-primary font-medium">
                {loading ? "Signing in..." : "Sign in"}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Right */}
      <div className="w-1/2 bg-primary rounded-xl p-8 text-5xl font-semibold flex items-center justify-center">
        <p>Welcome to Planit</p>
      </div>
    </div>
  );
};

export default LoginPage;
