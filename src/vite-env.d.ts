/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CALENDAR_API_KEY: string
  readonly VITE_GOOGLE_SHEETS_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
