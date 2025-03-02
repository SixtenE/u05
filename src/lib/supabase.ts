import {
  type AuthError,
  createClient,
  type PostgrestError,
  type User,
} from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
)

export interface Todo {
  id: string
  text: string
  user_id: User['id']
  completed: boolean
  created_at: Date
}

export async function signIn({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<{ user: User | null; error: AuthError | null }> {
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { user, error }
}

export async function signUp({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<{ user: User | null; error: AuthError | null }> {
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  })

  return { user, error }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getUser(): Promise<{
  data: { user: User | null }
  error: AuthError | null
}> {
  const { data, error } = await supabase.auth.getUser()
  return { data, error }
}

export async function createTodo({ todo }: { todo: Todo }): Promise<{
  error: PostgrestError | null
}> {
  const { error } = await supabase.from('todos').insert(todo)
  return { error }
}

export async function readTodos(): Promise<{
  data: Todo[] | null
  error: PostgrestError | null
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: null }
  }

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .returns<Todo[] | []>()
  return { data, error }
}

export async function updateTodo({ todo }: { todo: Todo }): Promise<{
  error: PostgrestError | null
}> {
  const { error } = await supabase
    .from('todos')
    .update({
      text: todo.text,
      completed: todo.completed,
    })
    .eq('id', todo.id)

  return { error }
}

export async function deleteTodo({ id }: { id: Todo['id'] }): Promise<{
  error: PostgrestError | null
}> {
  const { error } = await supabase.from('todos').delete().eq('id', id)

  return { error }
}

export async function deleteAllTodos({ userId }: { userId: string }): Promise<{
  error: PostgrestError | null
}> {
  const { error } = await supabase.from('todos').delete().eq('user_id', userId)

  return { error }
}
