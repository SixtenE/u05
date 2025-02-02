import { signIn } from './lib/supabase'

//queryselectors
const emailInput = document.querySelector('.auth-email') as HTMLInputElement
const passwordInput = document.querySelector(
  '.auth-password',
) as HTMLInputElement

document.querySelector('form')?.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = emailInput.value
  const password = passwordInput.value

  if (!email || email.trim() === '' || !password || password.trim() === '') {
    console.error('Email and password are required')
    return
  }

  const { user, error } = await signIn({
    email,
    password,
  })

  if (error) {
    console.error(error)
    return
  }

  if (!user) {
    console.error('No user found')
    return
  }

  window.location.href = '/u05/'
})
