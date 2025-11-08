import fs from "fs";
import path from "path";
import { templates } from "./templates.js";

export const generateModule = (nameCamel, namePascal, nameKebab, snakeCase) => {
    const modulePath = path.join(process.cwd(), "src/entities", nameKebab);

    if (fs.existsSync(modulePath)) {
        console.error(`❌ Module "${nameKebab}" already exists!`);
        process.exit(1);
    }

    fs.mkdirSync(modulePath, { recursive: true });
    console.log(`📁 Created folder: ${modulePath}`);




    fs.mkdirSync(`${modulePath}/api`, { recursive: true });
    console.log(`📁 Created folder: ${modulePath}`);

    const apiGetContent = templates["api/get"](namePascal, nameCamel, nameKebab, snakeCase);
    const apiGetFilePath = path.join(modulePath, "get.ts");
    fs.writeFileSync(apiGetFilePath, apiGetContent);

    const apiPutContent = templates["api/put"](namePascal, nameCamel, nameKebab, snakeCase);
    const apiPutFilePath = path.join(modulePath, "put.ts");
    fs.writeFileSync(apiPutFilePath, apiPutContent);

    const apiPatchContent = templates["api/patch"](namePascal, nameCamel, nameKebab, snakeCase);
    const apiPatchFilePath = path.join(modulePath, "patch.ts");
    fs.writeFileSync(apiPatchFilePath, apiPatchContent);

    const apiPostContent = templates["api/post"](namePascal, nameCamel, nameKebab, snakeCase);
    const apiPostFilePath = path.join(modulePath, "post.ts");
    fs.writeFileSync(apiPostFilePath, apiPostContent);

    const apiDeleteContent = templates["api/delete"](namePascal, nameCamel, nameKebab, snakeCase);
    const apiDeleteFilePath = path.join(modulePath, "delete.ts");
    fs.writeFileSync(apiDeleteFilePath, apiDeleteContent);

    const apiIndexContent = templates["api/index"](namePascal, nameCamel, nameKebab, snakeCase);
    const apiIndexFilePath = path.join(modulePath, "index.ts");
    fs.writeFileSync(apiIndexFilePath, apiIndexContent);



    fs.mkdirSync(`${modulePath}/hooks`, { recursive: true });
    console.log(`📁 Created folder: ${modulePath}`);

    const hooksGetContent = templates["hooks/get"](namePascal, nameCamel, nameKebab, snakeCase);
    const hooksGetFilePath = path.join(modulePath, "get.ts");
    fs.writeFileSync(hooksGetFilePath, hooksGetContent);

    const hooksPutContent = templates["hooks/put"](namePascal, nameCamel, nameKebab, snakeCase);
    const hooksPutFilePath = path.join(modulePath, "put.ts");
    fs.writeFileSync(hooksPutFilePath, hooksPutContent);

    const hooksPatchContent = templates["hooks/patch"](namePascal, nameCamel, nameKebab, snakeCase);
    const hooksPatchFilePath = path.join(modulePath, "patch.ts");
    fs.writeFileSync(hooksPatchFilePath, hooksPatchContent);

    const hooksPostContent = templates["hooks/post"](namePascal, nameCamel, nameKebab, snakeCase);
    const hooksPostFilePath = path.join(modulePath, "post.ts");
    fs.writeFileSync(hooksPostFilePath, hooksPostContent);

    const hooksDeleteContent = templates["hooks/delete"](namePascal, nameCamel, nameKebab, snakeCase);
    const hooksDeleteFilePath = path.join(modulePath, "delete.ts");
    fs.writeFileSync(hooksDeleteFilePath, hooksDeleteContent);

    const hooksIndexContent = templates["hooks/index"](namePascal, nameCamel, nameKebab, snakeCase);
    const hooksIndexFilePath = path.join(modulePath, "index.ts");
    fs.writeFileSync(hooksIndexFilePath, hooksIndexContent);



    fs.mkdirSync(`${modulePath}/types`, { recursive: true });
    console.log(`📁 Created folder: ${modulePath}`);

    const typesParamsContent = templates["types/params"](namePascal, nameCamel, nameKebab, snakeCase);
    const typesParamsFilePath = path.join(modulePath, "params.ts");
    fs.writeFileSync(typesParamsFilePath, typesParamsContent);

    const typesPayloadsContent = templates["types/payloads"](namePascal, nameCamel, nameKebab, snakeCase);
    const typesPayloadsFilePath = path.join(modulePath, "payloads.ts");
    fs.writeFileSync(typesPayloadsFilePath, typesPayloadsContent);

    const typesResponsesContent = templates["types/responses"](namePascal, nameCamel, nameKebab, snakeCase);
    const typesResponsesFilePath = path.join(modulePath, "responses.ts");
    fs.writeFileSync(typesResponsesFilePath, typesResponsesContent);

    const typesIndexContent = templates["types/index"](namePascal, nameCamel, nameKebab, snakeCase);
    const typesIndexFilePath = path.join(modulePath, "index.ts");
    fs.writeFileSync(typesIndexFilePath, typesIndexContent);



    const indexContent = templates["index"](namePascal, nameCamel, nameKebab);
    const indexFilePath = path.join(modulePath, "index.ts");
    fs.writeFileSync(indexFilePath, indexContent);



    // === UPDATE QUERY KEYS ENUM ===
    try {
        const queryKeysPath = path.join(process.cwd(), "src/shared/query-keys.ts");

        if (!fs.existsSync(queryKeysPath)) {
            console.warn("⚠️  query-keys.ts not found, skipping enum update.");
        } else {
            const content = fs.readFileSync(queryKeysPath, "utf8");

            // Регулярка, чтобы вставить перед закрывающей скобкой
            const updatedContent = content.replace(
                /export\s+enum\s+QueryKeys\s*{([^}]*)}/s,
                (match, body) => {
                    // Проверим, есть ли уже такой ключ
                    const newKey = `GET_${snakeCase.toUpperCase()}`;
                    if (body.includes(newKey)) {
                        console.warn(`⚠️  ${newKey} already exists in QueryKeys.`);
                        return match;
                    }

                    // Добавляем с запятой и отступом
                    const newBody = `${body.trimEnd()},\n  ${newKey}\n`;
                    return `export enum QueryKeys {${newBody}}`;
                }
            );

            fs.writeFileSync(queryKeysPath, updatedContent);
            console.log(`✨ Added ${"GET_" + snakeCase.toUpperCase()} to QueryKeys`);
        }
    } catch (err) {
        console.error("❌ Failed to update QueryKeys:", err);
    }
};
