import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faArrowRightToBracket,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import google from "../assets/google.png";
import apiClient from "../helpers/apiClient";

interface LoginResponse {
  token: string;
  user: { id: string; email: string; name: string };
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await apiClient.post<
      LoginResponse,
      { email: string; password: string }
    >("authenticate/login", { email, password });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      console.error("Login error:", error.details);
      return;
    }

    console.log("Login successful:", data);
    navigate("/");
  };

  return (
    <div className="h-screen flex p-8 bg-background">
      {/* Left */}
      <div className="w-1/2 flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col w-2/3 xl:w-2/5 gap-10 justify-center">
          <h1 className="text-5xl font-semibold">Login</h1>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
            {/* Inputs */}
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

            <label className="flex items-center w-fit gap-2 cursor-pointer mx-4">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleCheckbox}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <span className="select-none text-gray-600">Remember me</span>
            </label>

            {/* Buttons */}
            <div className="flex flex-col w-full gap-3">
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

              <div className="border-b-2 border-gray-400 w-full relative flex items-center">
                <span className="absolute bg-background text-gray-400 p-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                  OR
                </span>
              </div>

              <button
                type="button"
                disabled={loading}
                className="flex items-center justify-center gap-4 bg-primary shadow-md text-lg py-3 px-4 my-4 cursor-pointer rounded-md w-full select-none"
              >
                <img src={google} alt="" height={25} width={25} />
                <span className="text-gray-500 font-medium">
                  Continue with Google
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right */}
      <div className="w-1/2 bg-primary rounded-xl p-8">right</div>
    </div>
  );
};

export default LoginPage;
