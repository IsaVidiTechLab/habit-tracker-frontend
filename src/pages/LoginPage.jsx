import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = import.meta.env.VITE_API_URL;

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };
    axios
      .post(`${API_URL}/auth/login`, requestBody)
      .then((response) => {
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        console.log(errorDescription);
      });
  };

  return (
    <div className=" flex-col self-center">
    <div className=" flex flex-col justify-center items-center px-6 py-12 md:px-8 ">
      <div className="w-96 p-6 bg-white border border-gray-200 rounded-lg shadow">
        <h2 className="mt-10 text-center text-2xl font-semibold text-gray-700">
          Login to Habit Tracker
        </h2>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-normal leading-6 text-gray-700"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmail}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-normal leading-6 text-gray-700"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePassword}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <br />
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold leading-6 shadow-lg hover:bg-[#8E7AB5] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border  border- hover:border-transparent "
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-700 ">
            Not a member?
            <Link
              to={"/signup"}
              className="font-semibold leading-6 text-gray-700"
            >
              {" "}
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default LoginPage;
