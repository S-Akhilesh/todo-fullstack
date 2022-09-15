import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Todos = () => {
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      window.location.href = "/register";
    }
  }, []);
  return (
    <div>
      <Link to="category">Go to category</Link>
    </div>
  );
};

export default Todos;
