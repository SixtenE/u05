import { signUp } from './lib/supabase'

//queryselectors
const emailInput = document.querySelector('.auth-email') as HTMLInputElement
const passwordInput = document.querySelector(
  '.auth-password',
) as HTMLInputElement

document.querySelector('form')?.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = emailInput.value
  const password = passwordInput.value

  if (!email || email.trim() === '') {
    console.error('Email is required')
    return
  }

  if (!password || password.trim() === '') {
    console.error('Password is required')
    return
  }

  const { data, error } = await signUp(email, password)

  if (error) {
    console.error(error)
    return
  }

  if (!data.user) {
    console.error('No user found')
    return
  }

  console.log(data.user.id)
})
