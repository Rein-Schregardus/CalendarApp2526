import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faArrowRightToBracket, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import google from "../assets/google.png";
import { useState } from "react";
import type {ChangeEvent } from "react";

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className='h-screen flex p-8 bg-background'>
        {/* Left */}

        <div className="w-1/2 flex flex-col items-center justify-center gap-10">

          <div className="flex flex-col w-2/3 xl:w-2/5 gap-10 justify-center">

              <h1 className="text-5xl font-semibold">Login</h1>

              <form action="" className="w-full flex flex-col gap-6">

                {/* Inputs */}
                <div className="w-full flex flex-col gap-4">

                  <div className="relative w-full">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="text" placeholder="Email" className="bg-primary p-4 pl-10 rounded-md shadow-sm w-full focus:outline-none"/>
                  </div>

                  <div className="relative w-full">
                    <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>

                    <input type={viewPassword ? "text" : "password"} placeholder="Password" className="bg-primary p-4 pl-10 rounded-md shadow-sm w-full focus:outline-none"/>

                    <button 
                      type="button" 
                      onClick={() => setViewPassword(!viewPassword)} 
                      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2">
                      <FontAwesomeIcon icon={viewPassword ? faEyeSlash : faEye} className="text-gray-400"/>
                    </button>
                  </div>

                </div>

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
              
                  <button type="submit" className="flex items-center justify-center gap-4 bg-accent shadow-md text-lg py-3 px-4 my-4 cursor-pointer rounded-md w-full select-none">
                      <FontAwesomeIcon icon={faArrowRightToBracket}  className="text-primary" />
                      <span className="text-primary font-medium">Sign in</span>
                    </button>

                  <div className="border-b-2 border-gray-400 w-full relative flex items-center">
                    <span className="absolute bg-background text-gray-400 p-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">OR</span>
                  </div>

                  <button  type="button" className="flex items-center justify-center gap-4 bg-primary shadow-md text-lg py-3 px-4 my-4 cursor-pointer rounded-md w-full select-none">
                    <img src={google} alt="" height={25} width={25}/>
                    <span className="text-gray-500 font-medium">Continue with Google</span>
                  </button>

                </div>

            </form>

          </div>

        </div>

        {/* Right */}
        <div className="w-1/2 bg-primary rounded-xl p-8">
            right
        </div>
    </div>
  )
}

export default LoginPage