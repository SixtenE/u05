/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SUPABASE_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
