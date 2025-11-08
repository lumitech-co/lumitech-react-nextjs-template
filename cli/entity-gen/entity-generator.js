import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { templates } from "./templates.js";

export const generateEntity = (nameCamel, namePascal, nameKebab, snakeCase) => {
    const entityPath = path.join(process.cwd(), "src/entities", nameKebab);

    if (fs.existsSync(entityPath)) {
        console.error(`❌ Entity "${nameKebab}" already exists!`);
        process.exit(1);
    }

    fs.mkdirSync(entityPath, { recursive: true });
    console.log(`📁 Created folder: ${entityPath}`);




    const apiFolder = `${entityPath}/api`;
    fs.mkdirSync(apiFolder, { recursive: true });
    console.log(`📁 Created folder: ${apiFolder}`);

    const apiGetContent = templates["api/get"](namePascal, nameCamel, nameKebab, snakeCase);
    const apiGetFilePath = path.join(apiFolder, "get.ts");
    fs.writeFileSync(apiGetFilePath, apiGetContent);

    const apiPutContent = templates["api/put"](namePascal, nameCamel, nameKebab, snakeCase);
    const apiPutFilePath = path.join(apiFolder, "put.ts");
    fs.writeFileSync(apiPutFilePath, apiPutContent);

    const apiPatchContent = templates["api/patch"](namePascal, nameCamel, nameKebab, snakeCase);
    const apiPatchFilePath = path.join(apiFolder, "patch.ts");
    fs.writeFileSync(apiPatchFilePath, apiPatchContent);

    const apiPostContent = templates["api/post"](namePascal, nameCamel, nameKebab, snakeCase);
    const apiPostFilePath = path.join(apiFolder, "post.ts");
    fs.writeFileSync(apiPostFilePath, apiPostContent);

    const apiDeleteContent = templates["api/delete"](namePascal, nameCamel, nameKebab, snakeCase);
    const apiDeleteFilePath = path.join(apiFolder, "delete.ts");
    fs.writeFileSync(apiDeleteFilePath, apiDeleteContent);

    const apiIndexContent = templates["api/index"](namePascal, nameCamel, nameKebab, snakeCase);
    const apiIndexFilePath = path.join(apiFolder, "index.ts");
    fs.writeFileSync(apiIndexFilePath, apiIndexContent);



    const hooksFolder = `${entityPath}/hooks`;
    fs.mkdirSync(hooksFolder, { recursive: true });
    console.log(`📁 Created folder: ${hooksFolder}`);

    const hooksGetContent = templates["hooks/get"](namePascal, nameCamel, nameKebab, snakeCase);
    const hooksGetFilePath = path.join(hooksFolder, "get.ts");
    fs.writeFileSync(hooksGetFilePath, hooksGetContent);

    const hooksPutContent = templates["hooks/put"](namePascal, nameCamel, nameKebab, snakeCase);
    const hooksPutFilePath = path.join(hooksFolder, "put.ts");
    fs.writeFileSync(hooksPutFilePath, hooksPutContent);

    const hooksPatchContent = templates["hooks/patch"](namePascal, nameCamel, nameKebab, snakeCase);
    const hooksPatchFilePath = path.join(hooksFolder, "patch.ts");
    fs.writeFileSync(hooksPatchFilePath, hooksPatchContent);

    const hooksPostContent = templates["hooks/post"](namePascal, nameCamel, nameKebab, snakeCase);
    const hooksPostFilePath = path.join(hooksFolder, "post.ts");
    fs.writeFileSync(hooksPostFilePath, hooksPostContent);

    const hooksDeleteContent = templates["hooks/delete"](namePascal, nameCamel, nameKebab, snakeCase);
    const hooksDeleteFilePath = path.join(hooksFolder, "delete.ts");
    fs.writeFileSync(hooksDeleteFilePath, hooksDeleteContent);

    const hooksIndexContent = templates["hooks/index"](namePascal, nameCamel, nameKebab, snakeCase);
    const hooksIndexFilePath = path.join(hooksFolder, "index.ts");
    fs.writeFileSync(hooksIndexFilePath, hooksIndexContent);



    const typesFolder = `${entityPath}/types`;
    fs.mkdirSync(typesFolder, { recursive: true });
    console.log(`📁 Created folder: ${typesFolder}`);

    const typesParamsContent = templates["types/params"](namePascal, nameCamel, nameKebab, snakeCase);
    const typesParamsFilePath = path.join(typesFolder, "params.ts");
    fs.writeFileSync(typesParamsFilePath, typesParamsContent);

    const typesPayloadsContent = templates["types/payloads"](namePascal, nameCamel, nameKebab, snakeCase);
    const typesPayloadsFilePath = path.join(typesFolder, "payloads.ts");
    fs.writeFileSync(typesPayloadsFilePath, typesPayloadsContent);

    const typesResponsesContent = templates["types/responses"](namePascal, nameCamel, nameKebab, snakeCase);
    const typesResponsesFilePath = path.join(typesFolder, "responses.ts");
    fs.writeFileSync(typesResponsesFilePath, typesResponsesContent);

    const typesIndexContent = templates["types/index"](namePascal, nameCamel, nameKebab, snakeCase);
    const typesIndexFilePath = path.join(typesFolder, "index.ts");
    fs.writeFileSync(typesIndexFilePath, typesIndexContent);



    const indexContent = templates["index"](namePascal, nameCamel, nameKebab);
    const indexFilePath = path.join(entityPath, "index.ts");
    fs.writeFileSync(indexFilePath, indexContent);



    // === UPDATE entities/index.ts ===
    try {
        const indexPath = path.join(process.cwd(), "src/entities/index.ts");
        let content = "";

        if (fs.existsSync(indexPath)) {
            content = fs.readFileSync(indexPath, "utf8");
        } else {
            fs.writeFileSync(indexPath, "");
        }

        const exportLine = `export * from "./${nameKebab}";`;

        if (!content.includes(exportLine)) {
            content += (content.trimEnd() ? "\n" : "") + exportLine + "\n";
            fs.writeFileSync(indexPath, content);
            console.log(`✨ Added export for "${nameKebab}" to entities/index.ts`);
        } else {
            console.log(`⚠️ Export for "${nameKebab}" already exists in index.ts`);
        }
    } catch (err) {
        console.error("❌ Failed to update entities/index.ts:", err);
    }



    // === UPDATE QUERY KEYS ENUM ===
    try {
        const queryKeysPath = path.join(process.cwd(), "src/shared/constants/query-keys.ts");

        if (!fs.existsSync(queryKeysPath)) {
            console.warn("⚠️  query-keys.ts not found, skipping enum update.");
        } else {
            const content = fs.readFileSync(queryKeysPath, "utf8");

            const updatedContent = content.replace(
                /export\s+enum\s+QueryKeys\s*{([^}]*)}/s,
                (match, body) => {
                    const newInfiniteKey = `GET_INFINITE_${snakeCase.toUpperCase()}S`;
                    const newKey = `GET_${snakeCase.toUpperCase()}S`;

                    if (body.includes(newKey)) {
                        console.warn(`⚠️  ${newKey} already exists in QueryKeys.`);
                        return match;
                    }

                    // Убираем лишние запятые и пробелы в конце
                    const cleanedBody = body.trim().replace(/,+\s*$/, "");

                    // Добавляем аккуратно новый ключ
                    const newBody = `${cleanedBody},\n  ${newKey},\n  ${newInfiniteKey},`;
                    return `export enum QueryKeys {\n  ${newBody}\n}`;
                }
            );

            fs.writeFileSync(queryKeysPath, updatedContent);
            console.log(`✨ Added GET_${snakeCase.toUpperCase()} to QueryKeys`);
        }
    } catch (err) {
        console.error("❌ Failed to update QueryKeys:", err);
    }

    try {
        console.log("🧹 Running lint:fix...");
        execSync("npm run lint:fix", { stdio: "inherit" });
        console.log("✅ Linting complete!");
    } catch (error) {
        console.error("⚠️  Linting failed:", error.message);
    }
};
