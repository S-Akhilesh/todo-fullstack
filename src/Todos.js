import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Todos = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/register";
    }
  }, []);
  return <div></div>;
};

export default Todos;
