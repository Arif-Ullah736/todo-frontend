import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineDone } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const apiUrl = import.meta.env.VITE_API_URL;

const Todo = () => {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const onSubmiteForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/createTask`, {
        description,
        completed: false,
      });
      setDescription("");
      getTodos();
    } catch (error) {
      console.log(error.message);
    }
  };

  const getTodos = async () => {
    try {
      const res = await axios.get(`${apiUrl}/getAllTasks`);
      setTodos(res.data.data);
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getTodos();
  }, []);

  const saveEdit = async (id) => {
    try {
      await axios.put(`${apiUrl}/updateTask/${id}`, {
        description: editedText,
      });
      setEditingTodo(null);
      setEditedText("");
      getTodos();
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${apiUrl}/deleteTask/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  const toggleCompleted = async (id) => {
    try {
      const todo = todos.find((todo) => todo.id === id);
      await axios.put(`${apiUrl}/updateTask/${id}`, {
        description: todo.description,
        completed: !todo.completed,
      });
      setTodos((prev) =>
        prev.map(
          (todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo, // ✅ just return todo
        ),
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="bg-gray-50 w-full  max-w-lg p-8 shadow-xl  rounded-2xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 ">Todo App</h1>
      <form
        onSubmit={onSubmiteForm}
        className="flex items-center shadow-sm border rounded-lg gap-2 p-2 mb-6 "
      >
        <input
          className=" flex-1 outline-none w-full text-gray-700 px-3 py-2 placeholder-gray-400  "
          type="text"
          placeholder="What needs to be done?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button className=" bg-blue-500 hover:bg-blue-600  rounded-md font-medium text-white cursor-pointer py-2 px-4">
          Add Task
        </button>
      </form>
      {todos.length === 0 ? (
        <p className="text-gray-600">No tasks available. Add new Task!</p>
      ) : (
        <div className="flex  flex-col gap-y-4">
          {todos.map((todo, id) => (
            <div key={todo.id} className=" p-4">
              {editingTodo === todo.id ? (
                <div className=" flex items-center justify-between gap-x-3">
                  <input
                    type="text"
                    value={editedText}
                    className=" flex-1 p-3 rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner "
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <div className=" flex items-center justify-center gap-x-3">
                    <button
                      onClick={() => saveEdit(todo.id)}
                      className="bg-green-500 py-2 px-4 rounded-lg text-white hover:bg-green-700"
                    >
                      <MdOutlineDone size={20} />
                    </button>
                    <button className="bg-gray-500 py-2 px-4 rounded-lg text-white hover:bg-gray-700">
                      <IoClose size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div
                    key={id}
                    className="flex items-center  gap-x-4 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleCompleted(todo.id)}
                      className={` shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center ${todo.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-blue-400"} `}
                    >
                      {todo.completed && <MdOutlineDone size={16} />}
                    </button>
                    <span>{todo.description}</span>
                  </div>
                  <div className="flex items-center justify-center  gap-x-2  ">
                    <button
                      onClick={() => {
                        setEditingTodo(todo.id);
                        setEditedText(todo.description);
                      }}
                      className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 duration-300"
                    >
                      <MdModeEditOutline size={20} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 duration-300"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Todo;
