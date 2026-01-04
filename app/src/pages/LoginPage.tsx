import { useContext, useEffect, useState } from "react";
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

interface LoginResponse {
  token: string;
  user: TUser;
}

const LoginPage = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  // Check if user exists once
  useEffect(() => {
    let mounted = true;
    userContext.getCurrUserAsync().then(user => {
      if (user && mounted) navigate("/", { replace: true });
    });
    return () => { mounted = false; };
  }, [navigate, userContext]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const { error } = await apiClient.post<LoginResponse, { email: string; password: string }>(
      "auth/login",
      { email, password },
    );

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // after successful login, refetch user
    await userContext.getCurrUserAsync();
    navigate("/", { replace: true });
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
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="bg-primary p-4 pl-10 rounded-md shadow-sm w-full focus:outline-none"
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
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="bg-primary p-4 pl-10 rounded-md shadow-sm w-full focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setViewPassword(!viewPassword)}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2"
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
              className="flex items-center justify-center gap-4 bg-accent shadow-md text-lg py-3 px-4 my-4 cursor-pointer rounded-md w-full select-none disabled:opacity-60"
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
