/// <reference types="vite/client" />

// CSS Modules
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

// Regular CSS imports
declare module "*.css?inline" {
  const content: string;
  export default content;
}