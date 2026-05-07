/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Mirrors ROX_PRODUCT_BRANDING for local dev (Vite does not replace process.env on client in dev). */
    readonly VITE_ROX_PRODUCT_BRANDING?: string;
    /** Default VM prototype tier when no ?vmPrototype= query (v1–v4). */
    readonly VITE_VM_PROTOTYPE?: string;
}
