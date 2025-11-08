import { generateFeature } from "./feature-generator.js";

const featureName = process.argv[2];

if (!featureName) {
    console.error(
        "❌ Please provide a feature name. Example: npm run generate:feature featureName"
    );

    process.exit(1);
}

const nameCamel = featureName.charAt(0).toLowerCase() + featureName.slice(1);
const namePascal = featureName.charAt(0).toUpperCase() + featureName.slice(1);

const nameKebab = featureName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

const nameSnake = featureName
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();

// MODULE
generateFeature(nameCamel, namePascal, nameKebab, nameSnake);
