"use client";

import React, { useEffect, useState } from "react";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import '../app/page.module.css'; // Import the global CSS file


type Todo = {
  id: number;
  title: string;
};

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoToEdit, setTodoToEdit] = useState<Todo | undefined>(undefined);

  useEffect(() => {
    // Load todos from local storage when the component mounts
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else {
      // Fetch todos from the API if local storage is empty
      fetchTodos();
    }
  }, []);

  const fetchTodos = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
    const data = await response.json();
    setTodos(data);
    localStorage.setItem("todos", JSON.stringify(data)); // Save initial todos to local storage
  };

  const addTodo = (newTodo: Todo) => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos, newTodo];
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return updatedTodos;
    });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return updatedTodos;
    });
    setTodoToEdit(undefined); // Clear the edit mode
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return updatedTodos;
    });
  };

  const editTodo = (todo: Todo) => {
    setTodoToEdit(todo);
  };

  return (
    <div>
      <h1>Todo</h1>
      <TodoForm onAddTodo={addTodo} todoToEdit={todoToEdit} onUpdateTodo={updateTodo} />
      <TodoList onDeleteTodo={deleteTodo} onEditTodo={editTodo} todos={todos} />
    </div>
  );
};

export default Home;
