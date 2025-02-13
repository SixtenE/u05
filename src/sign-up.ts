import { signUp } from './lib/supabase'

const signUpForm = document.querySelector('form') as HTMLFormElement
const errorMessage = document.querySelector(
  '.error-message',
) as HTMLParagraphElement

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

  window.location.href = '/u05/'
})
