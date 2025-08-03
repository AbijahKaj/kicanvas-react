// This file contains custom type declarations to help with type errors

// Disable TS4094 for specific files
// @ts-ignore
declare namespace NodeJS {
    interface Global {
        // Allow properties like 'disposables', 'queryAssignedElements', 'updateComplete'
        // to be protected in exported class expressions
        '@ts-ignore': any;
    }
}

// Avoid duplicate identifier errors
declare module '*.css' {
    const content: string;
    export default content;
}

declare module '*.svg' {
    const content: string;
    export default content;
}