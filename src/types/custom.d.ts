// This file contains custom type declarations to help with type errors

// Avoid duplicate identifier errors
declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.glsl" {
  const content: string;
  export default content;
}

declare module "*.kicad_wks" {
  const content: string;
  export default content;
}
