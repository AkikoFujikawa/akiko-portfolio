import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const targets = [
  resolve(projectRoot, "backend", ".env"),
  resolve(projectRoot, "frontend", ".env.local"),
];
const internalApiKey = randomBytes(32).toString("hex");

async function updateInternalApiKey(filePath) {
  let content;

  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(
        `${filePath} が見つかりません。環境変数ファイルを作成してから、もう一度実行してください。`,
      );
    }

    throw error;
  }

  const newline = content.includes("\r\n") ? "\r\n" : "\n";
  const internalApiKeyLine = `INTERNAL_API_KEY=${internalApiKey}`;
  const internalApiKeyPattern = /^INTERNAL_API_KEY\s*=.*$/m;

  const updatedContent = internalApiKeyPattern.test(content)
    ? content.replace(internalApiKeyPattern, internalApiKeyLine)
    : `${content.replace(/\s*$/, "")}${newline}${internalApiKeyLine}${newline}`;

  await writeFile(filePath, updatedContent, "utf8");
}

await Promise.all(targets.map(updateInternalApiKey));

console.log(
  "backend/.env と frontend/.env.local の INTERNAL_API_KEY を同じ値に更新しました。",
);
console.log(
  "起動中のExpressとNext.jsを停止し、両方を再起動してください。",
);
