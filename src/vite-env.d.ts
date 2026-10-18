/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPEN_LIBRARY_API_BASE?: string;
  readonly VITE_OPEN_LIBRARY_COVERS_BASE?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_DEFAULT_LOAN_DAYS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
