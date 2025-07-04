interface ImportMetaEnv {
  readonly VITE_AUTO_LOGIN: string; 
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}