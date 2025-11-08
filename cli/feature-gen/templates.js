export const templates = {
    "index": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        export * from './lib';
        export * from './hooks';
        export * from './schemas';
        export * from './ui';
        export * from './types';
    `.trim(),
};
