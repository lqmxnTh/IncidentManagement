import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

function LoginPage() {
  const baseURL = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(["token", "user"]);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/login/`, {
        username,
        password,
      });

      const { token, user } = response.data;

      setCookie("token", token, { path: "/" });
      setCookie("user", JSON.stringify(user), { path: "/" });

      navigate("/");
    } catch (error) {
      setError(error.response.data.detail);
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="page-container">
      <div className="h-screen flex justify-center items-center mt-6 mb-8">
        <Card className="p-5" color="white" shadow={true}>
          <Typography variant="h4" color="blue-gray">
            Login
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Nice to Have You Back Login!
          </Typography>
          <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Email
              </Typography>
              <Input
                required={true}
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="lg"
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Password
              </Typography>
              <Input
                required={true}
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <Checkbox
              checked={showPassword}
              onChange={handlePasswordVisibility}
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  Show Password!
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button className="mt-6" fullWidth onClick={handleLogin}>
              Login
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
              Don't have an account?
              <Link to="/register" className="font-medium text-gray-900">
                Register
              </Link>
            </Typography>
          </form>
        </Card>
      </div>
      {/* <div className="form-container">
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="label-container">
            <label className="label" htmlFor="username">
              Email
            </label>
          </div>

          <input
            required={true}
            className="txt-box"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="label-container">
            <label className="label" htmlFor="password">
              Password
            </label>
          </div>
          <input
            required={true}
            className="txt-box"
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="label-container">
            <input
              className="password-visibility-checkbox"
              type="checkbox"
              id="password-visibility"
              checked={showPassword}
              onChange={handlePasswordVisibility}
            />
            <label
              className="password-visibility-label"
              htmlFor="password-visibility"
            >
              Show Password
            </label>
          </div>
          <div className="submit-btn-conatiner">
            <input className="submit-btn" type="submit" value="Login" />
          </div>
        </form>
      </div> */}
    </div>
  );
}

export default LoginPage;
