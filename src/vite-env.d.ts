/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL: string; // Define your variables here
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
