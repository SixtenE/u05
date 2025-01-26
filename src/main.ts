import './style.css'
import Sortable from 'sortablejs'
import { nanoid } from 'nanoid'
import type { User } from '@supabase/supabase-js'
import { animate } from 'motion'
import { supabase } from './lib/initSupabase'

interface Todo {
  id: string
  text: string
  completed: boolean
  created_at: Date
  user_id: string
}

let todos: Todo[] = []
let user: User | null = null

async function logIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'sixten@chas.at',
    password: 'nndqzzts',
  })

  if (error) {
    throw new Error(error.message)
  }

  user = data.user

  console.log(data)

  document.querySelector<HTMLButtonElement>(
    'header button.sign-in',
  )!.style.visibility = 'hidden'

  document.querySelector<HTMLButtonElement>(
    'header button.sign-out',
  )!.style.visibility = 'visible'

  fetchTodos()
}

async function deleteAllTodos() {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('user_id', user!.id)

  if (error) {
    throw new Error(error.message)
  }
}

async function fetchTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: true })
    .eq('user_id', user!.id)

  if (error) {
    throw new Error(error.message)
  }

  todos = data

  renderTodos()
}

function todoComponent(todo: Todo) {
  return `
        <li class="todo">
            ${
              todo.completed
                ? `<div class="icon-circle-check"></div>`
                : `<div class="icon-circle"></div>`
            }
            <p class="text">${todo.text}</p>
            <div class="icon-grip-vertical todo-icon"/>
        </li>
    `
}

function renderTodos() {
  const todosHTML = todos.map(todoComponent).reverse().join('')

  document.querySelector<HTMLUListElement>('.todos')!.innerHTML = todosHTML

  const el = document.querySelector<HTMLUListElement>('.todos')!
  Sortable.create(el, {
    animation: 300,
    handle: '.icon-grip-vertical',
    group: 'todos-order',
    store: {
      get: () => {
        const order = localStorage.getItem('todos-order')
        return order ? order.split('|') : []
      },
      set: (sortable) => {
        const order = sortable.toArray()
        localStorage.setItem('todos-order', order.join('|'))
      },
    },
  })
}

async function addTodo() {
  if (!user) return

  const textareaValue =
    document.querySelector<HTMLTextAreaElement>('.add-todo textarea')!.value

  if (textareaValue.trim() === '') return

  const todo: Todo = {
    id: nanoid(),
    text: textareaValue,
    completed: false,
    created_at: new Date(),
    user_id: user.id,
  }

  const { error } = await supabase.from('todos').insert([todo])

  if (error) {
    throw new Error(error.message)
  }

  todos.push(todo)

  document.querySelector<HTMLTextAreaElement>('.add-todo textarea')!.value = ''

  renderTodos()

  animate(
    '.todo:first-of-type',
    { scale: [0.9, 1], opacity: [0, 1] },
    { ease: 'circInOut', duration: 0.3 },
  )
}

document
  .querySelector<HTMLTextAreaElement>('.add-todo textarea')
  ?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTodo()
    }
  })

document
  .querySelector<HTMLButtonElement>('.add-todo button')
  ?.addEventListener('click', addTodo)

document
  .querySelector<HTMLHeadingElement>('header h1')
  ?.addEventListener('click', async () => {
    await deleteAllTodos()
    document.querySelector<HTMLUListElement>('.todos')!.innerHTML = ''
  })

document
  .querySelector<HTMLButtonElement>('.sign-in')
  ?.addEventListener('click', async () => {
    console.log('sign-in')
    await logIn()
  })

document
  .querySelector<HTMLButtonElement>('header button.sign-out')
  ?.addEventListener('click', async () => {
    await supabase.auth.signOut()
  })

console.log(await supabase.auth.getUser())
