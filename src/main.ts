import './style.css'
import { v4 as uuid } from 'uuid';

enum Status {
    NotStarted = "Not Started",
    InProgress = "In Progress",
    Completed = "Completed",
    OnHold = "On Hold",
}

namespace Status {
    export function parse(key: string) {
        switch (key) {
            case "NotStarted":
                return Status.NotStarted;
            case "InProgress":
                return Status.InProgress;
            case "Completed":
                return Status.Completed;
            case "OnHold":
                return Status.OnHold;

            default:
                throw new Error("Cannot Parse: Invalid Status Value");

        }
    }
}

type Todo = {
    id: string,
    name: string,
    completed: boolean,
    created: Date,
    status: Status
}

const mainView = document.querySelector<HTMLDivElement>("#todo-view");
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
        status: Status.NotStarted,
    };

    addTodo(todo);
});

const addTodoToDom = (todo: Todo) => {
    const item = document.createElement("li");
    item.classList.add("list-item", "radius");
    const label = document.createElement("label");
    label.classList.add("overflow-hidden", "md:overflow-none");
    const checkbox = document.createElement("input");
    const labelText = document.createElement("div");
    labelText.classList.add("overflow-hidden", "text-nowrap", "md:text-wrap", "md:overflow-none");
    const status = document.createElement("select");
    Object.values(Status).map((value, index) => {
        let option = document.createElement("option");
        if (typeof Object.values(Status)[index] === typeof "string") {
            option.value = Object.keys(Status)[index];
            option.append(value as Status);
            if (todo.status === value) {
                option.selected = true;
                status.dataset.status = option.value;
            }
            status.append(option);
        }
    });
    status.addEventListener("change", (e) => {
        const select = e.target as HTMLSelectElement;
        status.dataset.status = select.value;
        const todoIndex = todos.findIndex(task => task.id === todo.id);
        todos[todoIndex].status = Status.parse(select.value);
        localStorage.setItem("TODOS", JSON.stringify(todos));
    });
    status.classList.add("text-nowrap", "status", "align-center", "flex", "radius", "border-none");
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&times;";
    deleteButton.classList.add("close");
    deleteButton.addEventListener("click", () => {
        const todoIndex = todos.findIndex(task => task.id === todo.id);
        todos.splice(todoIndex, 1);
        localStorage.setItem("TODOS", JSON.stringify(todos));
        item.remove();
    });
    labelText.append(todo.name);
    status.append(todo.status);
    checkbox.type = "checkbox";
    checkbox.classList.add('checkbox');
    if (todo.completed) {
        checkbox.checked = true;
        labelText.classList.add('completed');
    }
    checkbox.addEventListener("change", () => {
        const todoIndex = todos.findIndex(task => task.id === todo.id);
        if (checkbox.checked) {
            labelText.classList.add('completed');
            todos[todoIndex].completed = true;
        } else {
            labelText.classList.remove('completed');
            todos[todoIndex].completed = false;
        }
        localStorage.setItem("TODOS", JSON.stringify(todos));
    });
    label.append(checkbox, labelText);
    item.append(label, status, deleteButton);
    todoList?.append(item);
    if (newTodoInput) newTodoInput.value = "";
}

const addTodo = (todo: Todo) => {
    addTodoToDom(todo);
    todos.push(todo);
    localStorage.setItem("TODOS", JSON.stringify(todos));
};

todos.forEach((todo, index) => {
    if (todo.status === undefined) {
        todos[index].status = Status.NotStarted;
    }
    addTodoToDom(todo);
});

localStorage.setItem("TODOS", JSON.stringify(todos));