import './style.css'
import Sortable from 'sortablejs'
import { nanoid } from 'nanoid'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

console.log(nanoid())

const todos: Todo[] = [
  {
    id: nanoid(),
    text: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
    completed: false,
    createdAt: new Date(),
  },
  {
    id: nanoid(),
    text: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
    completed: true,
    createdAt: new Date(),
  },
]

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <main class="container">
        <header>
            <h1>Todos</h1>
        </header>
        <ul class="todos">
        ${todos
          .map(
            (todo) => `
            <li class="todo">
                ${
                  todo.completed
                    ? `<div class="icon-circle-check"></div>`
                    : `<div class="icon-circle"></div>`
                }
                <p class="text">
                    ${todo.text}
                </p>
                <div class="icon-grip-vertical todo-icon"></div>
            </li>
        `,
          )
          .join('')}
        </ul>

        <form class="add-todo">
            <textarea name="text" placeholder="What needs to be done?"></textarea>
        </form>
    </main>
`

const el = document.querySelector<HTMLUListElement>('.todos')!
Sortable.create(el, {
  animation: 300,
  handle: '.icon-grip-vertical',
})
