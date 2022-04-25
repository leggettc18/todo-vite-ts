import './style.css'
import { v4 as uuid } from 'uuid';

type Todo = {
    id: string,
    name: string,
    completed: boolean,
    created: Date
}

const todoList = document.querySelector<HTMLUListElement>("#todo-list");
const newTodoForm = document.querySelector<HTMLFormElement>("#new-todo-form");
const newTodoInput = document.querySelector<HTMLInputElement>("#new-todo-name");
let todos: Todo[] = [];

const todosString = localStorage.getItem("TODOS")

if (todosString) todos = JSON.parse(todosString) as Todo[];

newTodoForm?.addEventListener("submit", e => {
    e.preventDefault();
    if (newTodoInput?.value == "" || newTodoInput?.value == null) return

    const todo: Todo = {
        id: uuid(),
        name: newTodoInput.value,
        completed: false,
        created: new Date(),
    };

    addTodo(todo);
});

const addTodoToDom = (todo: Todo) => {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const labelText = document.createElement("span");
    labelText.append(todo.name)
    checkbox.type = "checkbox";
    checkbox.classList.add('checkbox');
    label.append(checkbox, labelText);
    item.append(label);
    todoList?.append(item);
}

const addTodo = (todo: Todo) => {
    addTodoToDom(todo);
    todos.push(todo);
    localStorage.setItem("TODOS", JSON.stringify(todos));
};

todos.forEach(todo => {
    addTodoToDom(todo);
})