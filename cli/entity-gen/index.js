import { generateModule } from "./module-generator.js";

const moduleName = process.argv[2];

if (!moduleName) {
    console.error(
        "❌ Please provide a module name. Example: npm run generate:module moduleName"
    );

    process.exit(1);
}

const nameCamel = moduleName.charAt(0).toLowerCase() + moduleName.slice(1);
const namePascal = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

const nameKebab = moduleName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

const nameSnake = moduleName
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();

// MODULE
console.log({nameCamel, namePascal, nameKebab, nameSnake})
generateModule(nameCamel, namePascal, nameKebab, nameSnake);
