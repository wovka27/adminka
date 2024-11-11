/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_BASE_URL: string
  VITE_WS_KEY: string
  VITE_WS_HOST: string
  VITE_WS_PORT: string
  VITE_WSS_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
