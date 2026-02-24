import { useState } from "react";
import "./App.css";
import Todo from "./components/Todo";

function App() {
  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4 ">
      <Todo />
    </div>
  );
}

export default App;
