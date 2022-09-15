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
  const [edit, setEdit] = useState(false);
  const [todoId, setTodoId] = useState();
  const [statusId, setStatusId] = useState();
  const [category, setCategory] = useState();
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
    let response;
    if (edit) {
      const obj = {
        name: todo,
        category_id: category,
        status_id: statusId,
      };
      response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/todo/${todoId}`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } else {
      const obj = {
        name: todo,
        category_id: category,
        status_id: 1,
      };
      response = await axios.post(
        `${process.env.REACT_APP_API_URL}/todo/create`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }
    if (response.status === 200) {
      getTodo();
    }
    setTodo("");
    setEdit(false);
  };

  const changeTodoStatus = async (id, statusId) => {
    if (statusId === 3) statusId = 0;

    const obj = {
      status_id: statusId + 1,
    };
    const response = await axios.patch(
      `${process.env.REACT_APP_API_URL}/todo/${id}`,
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

  const editTodo = (todo) => {
    setEdit(true);
    setTodoId(todo.id);
    setCategory(todo.category_id);
    setStatusId(todo.status_id);
    setTodo(todo.name);
  };

  const sortArray = () => {
    let arr = [...todos];
    arr.sort((a, b) => a.category_id - b.category_id);
    setTodos(arr);
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
            <option value={category}>Select Category</option>
            {categories?.map((category, id) => {
              return (
                <option key={id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
          <input type="submit" value={edit ? "Edit Todo" : "Add todo"} />
        </form>
        <Link to="/category">View Categories</Link>
        {/* <button onClick={sortArray}>sort</button> */}
      </div>
      <div className="todos__body">
        {todos?.map((todo) => {
          return (
            <div key={todo.id} className="viewCategory">
              <div className="todoInfo">
                <p>{todo.name}</p>
                <span>{todo.c_name}</span>
                <span
                  onClick={() => changeTodoStatus(todo.id, todo.status_id)}
                  className={
                    todo.status_id === 1
                      ? "open"
                      : todo.status_id === 2
                      ? "progress"
                      : "complete"
                  }
                >
                  <u>{todo.s_name}</u>
                </span>
              </div>
              <div className="icons">
                <BsFillPencilFill
                  style={{ cursor: "pointer", color: "gray" }}
                  onClick={() => editTodo(todo)}
                />
                <MdDelete
                  onClick={() => deleteTodo(todo.id)}
                  style={{ cursor: "pointer", color: "darkred" }}
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
