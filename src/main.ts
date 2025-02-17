import { nanoid } from 'nanoid'
import {
  createTodo,
  deleteAllTodos,
  deleteTodo,
  getUser,
  readTodos,
  signIn,
  signOut,
  signUp,
  Todo,
  updateTodo,
} from './lib/supabase'
import type { User } from '@supabase/supabase-js'

//DOM ELEMENTS
const todosList = document.querySelector('.todos') as HTMLUListElement
const signOutButton = document.querySelector(
  '.sign-out-button',
) as HTMLButtonElement
const textArea = document.querySelector(
  '.add-todo-wrapper textarea',
) as HTMLTextAreaElement
const addTodoContainer = document.querySelector('.add-todo') as HTMLDivElement
const addTodoButton = document.querySelector(
  '.add-todo-button',
) as HTMLButtonElement
const deleteAllButton = document.querySelector(
  '.delete-all-button',
) as HTMLButtonElement

const toggleAuthButton = document.querySelectorAll(
  '.auth-toggle-button',
) as NodeListOf<HTMLButtonElement>
const signInForm = document.querySelector('.sign-in-form') as HTMLFormElement
const signUpForm = document.querySelector('.sign-up-form') as HTMLFormElement
const errorMessage = document.querySelector(
  '.error-message',
) as HTMLParagraphElement

let user: User | null = null
let editingTodo: Todo | null = null
let authState: 'sign-in' | 'sign-up' = 'sign-in'

function showLogInPage() {
  signInForm.style.display = 'flex'
  signUpForm.style.display = 'none'

  todosList.innerHTML = ''
  todosList.style.display = 'none'
  addTodoContainer.style.display = 'none'
  signOutButton.style.display = 'none'
}

function showTodoList() {
  errorMessage.style.display = 'none'
  signInForm.style.display = 'none'
  signUpForm.style.display = 'none'

  todosList.style.display = 'flex'
  addTodoContainer.style.display = 'flex'
  signOutButton.style.display = 'flex'

  fetchTodos()
}

function showSignUpPage() {
  signInForm.style.display = 'none'
  signUpForm.style.display = 'flex'

  todosList.style.display = 'none'
  addTodoContainer.style.display = 'none'
  signOutButton.style.display = 'none'
}

function addTodoToDom(todo: Todo) {
  const todoItem = document.createElement('li')
  todoItem.classList.add('todo')
  if (todo.completed) {
    todoItem.classList.add('completed')
  }

  const text = document.createElement('p')
  text.classList.add('text')
  text.textContent = todo.text

  const buttonGroup = document.createElement('div')
  buttonGroup.classList.add('button-group')

  const completeButton = document.createElement('button')
  completeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg>`

  completeButton.addEventListener('click', async () => {
    todoItem.classList.toggle('completed')

    completeTodo(todo)
  })

  const editButton = document.createElement('button')
  editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`

  editButton.addEventListener('click', () => {
    editingTodo = todo

    textArea.value = todo.text
    textArea.focus()
  })

  text.addEventListener('blur', async () => {
    console.log('blur')
    text.contentEditable = 'false'
  })

  const deleteButton = document.createElement('button')
  deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>`

  deleteButton.addEventListener('click', async () => {
    todoItem.remove()

    removeTodo(todo)
  })

  buttonGroup.appendChild(completeButton)
  buttonGroup.appendChild(editButton)
  buttonGroup.appendChild(deleteButton)

  todoItem.appendChild(text)

  todoItem.appendChild(buttonGroup)

  todosList.appendChild(todoItem)
  window.scrollTo(0, document.body.scrollHeight)
}

async function fetchTodos() {
  const { data, error } = await readTodos()

  if (error || !data) {
    console.error(error)
    return
  }

  todosList.innerHTML = ''

  data.forEach((todo) => {
    addTodoToDom(todo)
  })
}

async function checkUser() {
  const { data, error } = await getUser()

  if (error || !data.user) {
    showLogInPage()
    return
  }

  user = data.user

  showTodoList()
}

async function addTodo() {
  if (!user) {
    return
  }

  const text = textArea.value

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

  textArea.value = ''

  addTodoToDom(newTodo)

  const { error } = await createTodo({ todo: newTodo })

  if (error) {
    console.error(error)
    return
  }
}

async function completeTodo(todo: Todo) {
  const { error } = await updateTodo({
    todo: {
      ...todo,
      completed: !todo.completed,
    },
  })

  if (error) {
    console.error(error)
  }
}

async function editTodo(todo: Todo) {
  const { error } = await updateTodo({
    todo: {
      ...todo,
      text: textArea.value,
    },
  })
  if (error) {
    console.error(error)
  }

  fetchTodos()
}

async function removeTodo(todo: Todo) {
  const { error } = await deleteTodo({ id: todo.id })
  if (error) {
    console.error(error)
  }
}

signOutButton.addEventListener('click', async () => {
  const { error } = await signOut()
  if (error) {
    console.error(error)
    return
  }
  showLogInPage()
})

addTodoButton.addEventListener('click', () => {
  addTodo()
})

deleteAllButton.addEventListener('click', async () => {
  if (!user) {
    return
  }

  const { error } = await deleteAllTodos({ userId: user.id })

  if (error) {
    console.error(error)
    return
  }

  todosList.innerHTML = ''
})

textArea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    if (editingTodo) {
      editTodo(editingTodo)
    } else {
      addTodo()
    }
  }
})

textArea.addEventListener('blur', () => {
  if (editingTodo) {
    textArea.value = ''
    editingTodo = null
  }
})

toggleAuthButton.forEach((button) => {
  button.addEventListener('click', () => {
    if (authState === 'sign-in') {
      authState = 'sign-up'
      showSignUpPage()
    } else {
      authState = 'sign-in'
      showLogInPage()
    }
  })
})

signInForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const form = e.target as HTMLFormElement

  const formData = new FormData(form)

  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errorMessage.style.display = 'block'
    errorMessage.textContent = 'Email is required'
    return
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    errorMessage.style.display = 'block'
    errorMessage.textContent = 'Password is required'
    return
  }

  const { user, error } = await signIn({ email, password })

  if (error || !user) {
    errorMessage.style.display = 'block'
    errorMessage.textContent = 'Error signing in'
    return
  }

  form.reset()

  showTodoList()
})

signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const form = e.target as HTMLFormElement

  const formData = new FormData(form)

  const email = formData.get('email')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirm-password')

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errorMessage.style.display = 'block'
    errorMessage.textContent = 'Email is required'
    return
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    errorMessage.style.display = 'block'
    errorMessage.textContent = 'Password is required'
    return
  }

  if (
    !confirmPassword ||
    typeof confirmPassword !== 'string' ||
    confirmPassword.trim() === '' ||
    confirmPassword !== password
  ) {
    errorMessage.style.display = 'block'
    errorMessage.textContent = 'Passwords do not match'
    return
  }

  const { user, error } = await signUp({ email, password })

  if (error || !user) {
    errorMessage.style.display = 'block'
    errorMessage.textContent = 'An error occurred. Please try again.'
    return
  }

  form.reset()

  showTodoList()
})

showLogInPage()

checkUser()
