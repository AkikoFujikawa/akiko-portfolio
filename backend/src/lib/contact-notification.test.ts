import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildContactNotificationEmail,
  readContactNotificationConfig,
  sendContactNotification,
  type ContactNotificationConfig,
} from "./contact-notification";

const config: ContactNotificationConfig = {
  apiKey: "test-api-key",
  from: "sender@example.com",
  to: "owner@example.com",
  adminPageUrl: "https://example.com/admin/login",
};

const createdAt = new Date("2026-11-22T12:30:00.000Z");

describe("readContactNotificationConfig", () => {
  const env = {
    RESEND_API_KEY: "test-api-key",
    CONTACT_NOTIFICATION_FROM: "sender@example.com",
    CONTACT_NOTIFICATION_TO: "owner@example.com",
    ADMIN_PAGE_URL: "https://example.com/admin/login",
  };

  it("すべて設定されていれば読み取る", () => {
    expect(readContactNotificationConfig(env)).toEqual(config);
  });

  it("足りない値があれば null を返す", () => {
    expect(
      readContactNotificationConfig({ ...env, RESEND_API_KEY: "" }),
    ).toBeNull();
    expect(
      readContactNotificationConfig({
        ...env,
        CONTACT_NOTIFICATION_TO: undefined,
      }),
    ).toBeNull();
  });

  it("管理画面のURLが http(s) でなければ null を返す", () => {
    expect(
      readContactNotificationConfig({
        ...env,
        ADMIN_PAGE_URL: "javascript:alert(1)",
      }),
    ).toBeNull();
  });
});

describe("buildContactNotificationEmail", () => {
  it("受信日時を日本時間で入れ、管理画面のURLを案内する", () => {
    const email = buildContactNotificationEmail(createdAt, config);

    expect(email.to).toEqual(["owner@example.com"]);
    expect(email.text).toContain("2026/11/22 21:30");
    expect(email.text).toContain("https://example.com/admin/login");
  });

  it("APIキーをメールに入れない", () => {
    const email = buildContactNotificationEmail(createdAt, config);

    expect(JSON.stringify(email)).not.toContain("test-api-key");
  });
});

describe("sendContactNotification", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("設定がなければ、送信せず false を返す", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendContactNotification(createdAt, null)).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("成功すると true を返し、APIキーをヘッダーで送る", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendContactNotification(createdAt, config)).resolves.toBe(
      true,
    );

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer test-api-key");
    expect(options.body).not.toContain("test-api-key");
  });

  it("Resend がエラーを返しても、例外を投げない", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 403 })),
    );

    await expect(sendContactNotification(createdAt, config)).resolves.toBe(
      false,
    );
  });

  it("通信に失敗しても、例外を投げない", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    await expect(sendContactNotification(createdAt, config)).resolves.toBe(
      false,
    );
  });
});
