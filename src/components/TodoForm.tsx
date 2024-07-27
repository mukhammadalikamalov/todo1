"use client";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type TodoFormInput = {
    title: string;
}

type TodoFormProps = {
    onAddTodo: (newTodo: { id: number; title: string }) => void;
    todoToEdit?: { id: number; title: string }; // Optional prop for editing
    onUpdateTodo?: (todo: { id: number; title: string }) => void; // Optional prop for updating
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo, todoToEdit, onUpdateTodo }) => {
    const { reset, handleSubmit, register } = useForm<TodoFormInput>({
        defaultValues: {
            title: todoToEdit ? todoToEdit.title : ""
        }
    });

    const onSubmit: SubmitHandler<TodoFormInput> = async (data) => {
        if (todoToEdit) {
            // Update existing todo
            await fetch(`https://jsonplaceholder.typicode.com/todos/${todoToEdit.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({ ...todoToEdit, title: data.title }),
            });
            onUpdateTodo?.({ ...todoToEdit, title: data.title });
        } else {
            // Add new todo
            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({ title: data.title, userId: 1, completed: false }),
            });
            const newTodo = await response.json();
            onAddTodo({ id: newTodo.id, title: data.title });
        }
        reset();
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    {...register("title", { required: true })}
                    placeholder="Enter Todo"
                />
                <button type="submit">{todoToEdit ? 'Update' : 'Add'}</button>
            </form>
        </>
    );
}

export default TodoForm;
