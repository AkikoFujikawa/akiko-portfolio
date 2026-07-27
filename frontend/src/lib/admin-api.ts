//秘密の内部APIキーはNext.jsサーバー内だけで使用され、ブラウザには渡りません
export async function adminApiFetch(
  path: string,
  options: RequestInit,
): Promise<Response> {
  const backendUrl = process.env.BACKEND_URL;
  const internalApiKey = process.env.INTERNAL_API_KEY;

  if (!backendUrl || !internalApiKey) {
    throw new Error(
      "管理APIに必要な環境変数が設定されていません",
    );
  }

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");
  headers.set("x-internal-api-key", internalApiKey);

  const response = await fetch(
    `${backendUrl.replace(/\/$/, "")}${path}`,
    {
      ...options,
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Express管理APIの処理に失敗しました: ${response.status}`,
    );
  }

  return response;
}