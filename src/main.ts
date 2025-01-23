import './style.css'
import Sortable from 'sortablejs'
import { nanoid } from 'nanoid'
import { createClient } from '@supabase/supabase-js'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

const supabaseUrl = 'https://nbodsrunndqzztsvilcc.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const { data: mama, error } = await supabase.from('todos').select('*')

if (!error) {
  console.log(mama)
}

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
