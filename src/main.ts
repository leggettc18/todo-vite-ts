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
    item.classList.add("list-item", "radius");
    const label = document.createElement("label");
    label.classList.add("overflow-hidden", "md:overflow-none");
    const checkbox = document.createElement("input");
    const labelText = document.createElement("div");
    labelText.classList.add("overflow-hidden", "text-nowrap", "md:text-wrap", "md:overflow-none");
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML= "&times;";
    deleteButton.classList.add("close");
    deleteButton.addEventListener("click", () => {
        const todoIndex = todos.findIndex(task => task.id === todo.id);
        todos.splice(todoIndex, 1);
        localStorage.setItem("TODOS", JSON.stringify(todos));
        item.remove();
    });
    labelText.append(todo.name)
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
    item.append(label, deleteButton);
    todoList?.append(item);
    if (newTodoInput) newTodoInput.value = "";
}

const addTodo = (todo: Todo) => {
    addTodoToDom(todo);
    todos.push(todo);
    localStorage.setItem("TODOS", JSON.stringify(todos));
};

todos.forEach(todo => {
    addTodoToDom(todo);
})