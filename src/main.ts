import './style.css'
import Sortable from 'sortablejs'
import { nanoid } from 'nanoid'
import { createClient } from '@supabase/supabase-js'
import { stagger, animate } from 'motion'

interface Todo {
  id: string
  text: string
  completed: boolean
  created_at: Date
}

const supabaseUrl = 'https://nbodsrunndqzztsvilcc.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function logIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'sixten@chas.at',
    password: 'nndqzzts',
  })

  if (error) {
    throw new Error(error.message)
  }

  console.log(data.user)
}

logIn()

//const URLPath = new URL(window.location.href).pathname

async function fetchTodos() {
  const { data: todos, error } = await supabase.from('todos').select('*')
  //.eq('id', URLPath.substring(1))

  if (error) {
    throw new Error(error.message)
  }

  renderTodos(todos)
}

fetchTodos()

function renderTodos(todos: Todo[]) {
  if (todos.length === 0) return

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
            <button type="submit">Add Todo</button>
        </form>
    </main>
    `

  const el = document.querySelector<HTMLUListElement>('.todos')!
  Sortable.create(el, {
    animation: 300,
    handle: '.icon-grip-vertical',
  })

  animate(
    '.todos li',
    { scale: [0.9, 1], y: [10, 0], opacity: [0, 1] },
    { delay: stagger(0.05), duration: 0.1, ease: 'easeIn' },
  )

  document
    .querySelector<HTMLFormElement>('.add-todo')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault()

      const formData = new FormData(e.target as HTMLFormElement)

      const text = formData.get('text') as string

      if (text.trim() === '') return

      const todo: Todo = {
        id: nanoid(),
        text,
        completed: false,
        created_at: new Date(),
      }

      const { error } = await supabase.from('todos').insert([todo])

      if (error) {
        throw new Error(error.message)
      }

      fetchTodos()
    })
}
