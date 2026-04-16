/// <reference types="vite/client" />

declare module "*.glsl?raw" {
  const value: string;
  export default value;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ENABLE_MOBILE_FALLBACK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
