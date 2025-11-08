import { generateEntity } from "./entity-generator.js";

const entityName = process.argv[2];

if (!entityName) {
    console.error(
        "❌ Please provide a entity name. Example: npm run generate:entity entityName"
    );

    process.exit(1);
}

const nameCamel = entityName.charAt(0).toLowerCase() + entityName.slice(1);
const namePascal = entityName.charAt(0).toUpperCase() + entityName.slice(1);

const nameKebab = entityName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

const nameSnake = entityName
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();

// MODULE
generateEntity(nameCamel, namePascal, nameKebab, nameSnake);
