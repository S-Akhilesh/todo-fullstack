import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Registration.css";
import axios from "axios";

export const Registration = () => {
  const [isLogin, setLogin] = useState(false);
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      window.location.href = "/todos";
    }
  }, []);

  const register = async (e) => {
    e.preventDefault();
    console.log("register", username, email, password);
    const obj = {
      username,
      email,
      password,
    };
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/register`,
      obj
    );
    console.log("res", response);
    if (response.status === 200) {
      alert("User Registered, Please login");
      setLogin(true);
    } else if (response.status !== 200) {
      alert("Error, Try again later");
    }
  };

  const login = async (e) => {
    e.preventDefault();

    const encodedData = "Basic " + window.btoa(`${email}:${password}`);
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/login`,
      {
        headers: {
          Authorization: `${encodedData}`,
        },
      }
    );
    console.log("res", response);
    if (response.status === 200) {
      localStorage.setItem("token", response.data.data?.token);
      window.location.href = "/category";
    } else if (response.status !== 200) {
      alert("Login Failed");
    }
  };

  return (
    <div className="registration">
      <div className="registration__card">
        <div className="registration__header">
          <div
            className={
              isLogin ? "registration__box" : "registration__box active"
            }
            onClick={() => setLogin(false)}
          >
            Registration
          </div>
          <div
            className={
              isLogin ? "registration__box active" : "registration__box "
            }
            onClick={() => setLogin(true)}
          >
            Login
          </div>
        </div>
        {isLogin ? (
          <form className="registration__body" onSubmit={login}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input type="submit" value="Login" />
          </form>
        ) : (
          <form className="registration__body" onSubmit={register}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input type="submit" value="Regitser" />
          </form>
        )}
      </div>
      <Link to="/todos">TODO</Link>
    </div>
  );
};
