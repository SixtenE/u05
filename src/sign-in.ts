import { signIn } from './lib/supabase'

const signInForm = document.querySelector('.sign-in-form') as HTMLFormElement
const errorMessage = document.querySelector(
  '.error-message',
) as HTMLParagraphElement

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

  //SHOW TODO LIST
})
