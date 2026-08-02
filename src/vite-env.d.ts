/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Proxy URL for Roboflow API (optional - defaults to /api/proxy-roboflow)
  // For Vercel deployment, set this to your Vercel function URL
  readonly VITE_ROBOFLOW_PROXY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 
