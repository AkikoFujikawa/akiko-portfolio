// 管理画面用に、お問い合わせを Express から取得する
// adminApiFetch が内部APIキーを付け、キャッシュせずに毎回取得する
import { adminApiFetch } from "@/lib/admin-api";

export type AdminContact = {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type AdminContactList = {
  contacts: AdminContact[];
  unreadCount: number;
};

export async function getAdminContacts(): Promise<AdminContactList> {
  const response = await adminApiFetch("/api/admin/contacts", {
    method: "GET",
  });

  return (await response.json()) as AdminContactList;
}
