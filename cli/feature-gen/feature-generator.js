import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { templates } from "./templates.js";

export const generateFeature = (nameCamel, namePascal, nameKebab, snakeCase) => {
    const featurePath = path.join(process.cwd(), "src/features", nameKebab);

    if (fs.existsSync(featurePath)) {
        console.error(`❌ Feature "${nameKebab}" already exists!`);
        process.exit(1);
    }

    fs.mkdirSync(featurePath, { recursive: true });
    console.log(`📁 Created folder: ${featurePath}`);



    const libFolder = `${featurePath}/lib`;
    fs.mkdirSync(libFolder, { recursive: true });
    console.log(`📁 Created folder: ${libFolder}`);

    const libGitKeep = path.join(libFolder, ".gitkeep");
    fs.writeFileSync(libGitKeep, "");



    const hooksFolder = `${featurePath}/hooks`;
    fs.mkdirSync(hooksFolder, { recursive: true });
    console.log(`📁 Created folder: ${hooksFolder}`);

    const hooksGitkeep = path.join(hooksFolder, ".gitkeep");
    fs.writeFileSync(hooksGitkeep, "");



    const schemasFolder = `${featurePath}/schemas`;
    fs.mkdirSync(schemasFolder, { recursive: true });
    console.log(`📁 Created folder: ${schemasFolder}`);

    const schemasGitkeep = path.join(schemasFolder, ".gitkeep");
    fs.writeFileSync(schemasGitkeep, "");



    const uiFolder = `${featurePath}/ui`;
    fs.mkdirSync(uiFolder, { recursive: true });
    console.log(`📁 Created folder: ${uiFolder}`);

    const uiGitkeep = path.join(uiFolder, ".gitkeep");
    fs.writeFileSync(uiGitkeep, "");



    const typesFolder = `${featurePath}/types`;
    fs.mkdirSync(typesFolder, { recursive: true });
    console.log(`📁 Created folder: ${typesFolder}`);

    const typesGitkeep = path.join(typesFolder, ".gitkeep");
    fs.writeFileSync(typesGitkeep, "");



    const indexContent = templates["index"](namePascal, nameCamel, nameKebab, snakeCase);
    const indexFilePath = path.join(featurePath, "index.ts");
    fs.writeFileSync(indexFilePath, indexContent);



    try {
        console.log("🧹 Running lint:fix...");
        execSync("npm run lint:fix", { stdio: "inherit" });
        console.log("✅ Linting complete!");
    } catch (error) {
        console.error("⚠️  Linting failed:", error.message);
    }
};
