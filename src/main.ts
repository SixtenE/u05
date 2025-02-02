import type { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'

/*
    TYPES
*/
/* 
interface Todo {
  id: string
  user_id: User['id']
  text: string
  completed: boolean
  created_at: string
} */

/*
    VARIABLES
*/

let user: User | null = null

/* 
    DOM ELEMENTS
*/

//AUTH SWITCH
const toggleAuthLinks = document.querySelectorAll(
  '.auth-footer p',
) as NodeListOf<HTMLParagraphElement>

//AUTH ERROR MESSAGE
const authErrorMessage = document.querySelector(
  '.error-message',
) as HTMLParagraphElement

//AUTH CONTAINER
const authContainer = document.querySelector(
  '.auth-container',
) as HTMLDivElement

//SIGN IN FORM
const signInForm = document.querySelector('.sign-in-form') as HTMLFormElement

//SIGN UP FORM
const signUpForm = document.querySelector('.sign-up-form') as HTMLFormElement

//SIGN OUT BUTTON
const signOutButton = document.querySelector(
  '.sign-out-button',
) as HTMLButtonElement

//TODOS LIST
const todosList = document.querySelector('.todos') as HTMLUListElement

/*
    FUNCTIONS
*/

function showElement(element: HTMLElement) {
  element.style.display = 'flex'
}

function hideElement(element: HTMLElement) {
  element.style.display = 'none'
}

function handleLogin() {
  hideElement(authContainer)

  showElement(signOutButton)

  showElement(todosList)
}

async function renderTodos() {}

/* async function checkActiveSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session) {
    return
  }

  user = session.user

  renderTodos()

  console.log('Active session:', user)
} */

/* supabase.auth.signInWithPassword({
  email: 'sixten@chas.at',
  password: 'nndqzzts',
}) */

supabase.auth.onAuthStateChange(async (event, session) => {
  if (!session) return

  if (event === 'SIGNED_IN') {
    console.log(session.user.email)
    handleLogin()
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out')
  } else return
})

/*
    EVENT LISTENERS
*/

//SHOW AND HIDE SIGN IN AND SIGN UP FORMS
toggleAuthLinks.forEach((link) => {
  link.addEventListener('click', () => {
    signInForm.style.display =
      signInForm.style.display === 'none' ? 'flex' : 'none'
    signUpForm.style.display =
      signInForm.style.display === 'none' ? 'flex' : 'none'
  })
})

//SIGN OUT BUTTON
signOutButton.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut()

  hideElement(todosList)
  showElement(authContainer)
  hideElement(signOutButton)
})

window.logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error(error)
    return
  }
  console.log('User signed out')
}

//SIGN IN FORM
signInForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const formData = new FormData(signInForm)

  const email = formData.get('email')
  const password = formData.get('password')

  if (
    !email ||
    typeof email !== 'string' ||
    !password ||
    typeof password !== 'string'
  ) {
    authErrorMessage.classList.remove('hidden')
    return
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error) {
    authErrorMessage.style.display = 'flex'
    authErrorMessage.textContent = 'Invalid email or password'
  }
  return
})

//SIGN UP FORM
signUpForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const formData = new FormData(signUpForm)

  const email = formData.get('email')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirm-password')

  if (!email || !password || !confirmPassword) {
    return
  }

  if (password !== confirmPassword) {
    return
  }

  console.log(email, password, confirmPassword)
})

document.addEventListener('DOMContentLoaded', () => {
  hideElement(signUpForm)
})
