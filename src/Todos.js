import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Todos.css";
import { MdDelete } from "react-icons/md";
import { BsFillPencilFill } from "react-icons/bs";

const Todos = () => {
  const [todos, setTodos] = useState();
  const [todo, setTodo] = useState("");
  const [category, setCategory] = useState({});
  const [categories, setCategories] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/register";
    } else {
      getTodo();
      getCategories();
    }
  }, []);

  const getTodo = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/todo/user`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 200) {
      setTodos(response.data.data);
    }
  };

  const getCategories = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/category`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 200) {
      setCategories(response.data.data);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (todo === "" || category === undefined || category === "Select Category")
      return;
    const obj = {
      name: todo,
      category_id: category,
      status_id: 1,
    };
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/todo/create`,
      obj,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 200) {
      getTodo();
    }
    setTodo("");
  };

  const deleteTodo = async (id) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/todo/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 200) {
      getTodo();
    }
  };

  return (
    <div className="todos">
      <div className="todos__header">
        <form onSubmit={addTodo}>
          <input
            type="text"
            placeholder="Todo.."
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <select onChange={(event) => setCategory(event.target.value)}>
            <option value="Select Category">Select Category</option>
            {categories?.map((category, id) => {
              return (
                <option key={id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
          <input type="submit" value="Add todo" />
        </form>
        <Link to="/category">View Categories</Link>
      </div>
      <div className="todos__body">
        {todos?.map((todo) => {
          return (
            <div key={todo.id} className="viewCategory">
              {todo.name}
              <div className="icons">
                <BsFillPencilFill
                  style={{ cursor: "pointer" }}
                  // onClick={() => editCategory(category.id, category)}
                />
                <MdDelete
                  onClick={() => deleteTodo(todo.id)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Todos;
