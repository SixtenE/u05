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

  const { data, error } = await signIn(email, password)
  // Redirect or handle successful sign-in

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
