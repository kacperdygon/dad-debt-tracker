declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
    PORT: string;
    FRONTEND_URL: string;
  }
}