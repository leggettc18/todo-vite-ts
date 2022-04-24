import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Todo List</h1>
  <form id=new-task-form>
    <input id="new-todo-name"></input>
    <button id="new-todo-button">Add</button>
  </form>
`
