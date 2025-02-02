import { nanoid } from 'nanoid'
import { createTodo, getUser, readTodos, signOut, Todo } from './lib/supabase'
import type { User } from '@supabase/supabase-js'

const todosList = document.querySelector('.todos') as HTMLUListElement
const signOutButton = document.querySelector(
  '.sign-out-button',
) as HTMLButtonElement
const addTodoForm = document.querySelector('.add-todo-form') as HTMLFormElement
const textArea = document.querySelector(
  '.add-todo-form textarea',
) as HTMLTextAreaElement

let user: User | null = null

function addTodoItem(todo: Todo) {
  const todoItem = document.createElement('li')
  todoItem.classList.add('todo')
  todoItem.textContent = todo.text
  todosList.appendChild(todoItem)
}

async function fetchTodos() {
  const { data: todos, error: todosError } = await readTodos()

  if (todosError) {
    console.error(todosError)
  }

  todos?.forEach((todo) => {
    addTodoItem(todo)
  })
}

async function checkUser() {
  const { data, error } = await getUser()

  if (error || !data) {
    window.location.href = '/u05/sign-in'
  }

  user = data.user

  fetchTodos()
}

signOutButton.addEventListener('click', async () => {
  const { error } = await signOut()
  if (error) {
    console.error(error)
    return
  }
  window.location.href = '/u05/sign-in'
})

addTodoForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  if (!user) {
    return
  }

  const form = e.target as HTMLFormElement

  const formData = new FormData(form)

  const text = formData.get('text') as string

  console.log(text)

  if (!text || text.trim() === '') {
    console.error('Text is required')
    return
  }

  const newTodo: Todo = {
    id: nanoid(),
    completed: false,
    text,
    created_at: new Date(),
    user_id: user.id,
  }

  const { error } = await createTodo({ todo: newTodo })

  if (error) {
    console.error(error)
    return
  }

  addTodoItem(newTodo)

  form.reset()
})

textArea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    const form = document.querySelector('.add-todo-form') as HTMLFormElement

    form.requestSubmit()
  }
})

checkUser()
