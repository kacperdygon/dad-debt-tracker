/// <reference types="vite/client" />
declare namespace NodeJS {
  interface ProcessEnv {
    VITE_BACKEND_URL: string;
  }
}