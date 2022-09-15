import React, { useState } from "react";
import "./Category.css";
import { MdDelete } from "react-icons/md";
import { BsFillPencilFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Category = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState();
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/register";
    } else {
      getCategories();
    }
  }, []);

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

  const addCategory = async (e) => {
    e.preventDefault();
    if (category === "") return;
    let response;
    edit
      ? (response = await axios.patch(
          `${process.env.REACT_APP_API_URL}/category/${id}`,
          {
            name: category,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ))
      : (response = await axios.post(
          `${process.env.REACT_APP_API_URL}/category/create`,
          {
            name: category,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ));
    if (response.status === 200) {
      getCategories();
    }
    setCategory("");
    setEdit(false);
  };

  const deleteCategory = async (id) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/category/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 200) {
      getCategories();
    }
  };

  const editCategory = async (id, category) => {
    setEdit(true);
    setCategory(category.name);
    setId(id);
  };

  useEffect(() => {
    let cats = localStorage.getItem("categories");
    setCategories(JSON.parse(cats));
  }, []);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  return (
    <div className="category">
      <form onSubmit={addCategory}>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input type="submit" value={edit ? "Edit Category" : "Add Category"} />
        <Link to="/todos">View todo</Link>
      </form>
      {categories?.map((category) => {
        return (
          <div key={category.id} className="viewCategory">
            {category.name}
            <div className="icons">
              <BsFillPencilFill
                style={{ cursor: "pointer" }}
                onClick={() => editCategory(category.id, category)}
              />
              <MdDelete
                onClick={() => deleteCategory(category.id)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Category;
