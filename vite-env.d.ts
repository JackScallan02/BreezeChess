interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_FB_KEY: string;
  readonly VITE_PROJECT_ID: string;
  readonly VITE_FB_PROJECT_ID: string;
  readonly VITE_FB_MESSAGING_SENDER_ID: string;
  readonly VITE_FB_APP_ID: string;
  readonly VITE_FB_MEASUREMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}