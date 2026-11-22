import { getAdminContacts, type AdminContactList } from "@/lib/admin-contacts";
import { formatContactDate } from "@/lib/contact-date";
import { updateContactRead } from "./actions";

// 管理画面の中で使う部品。呼び出し元の page.tsx が管理者か確認してから表示する
export default async function ContactList() {
  let contactList: AdminContactList | null = null;

  // 取得に失敗しても、管理画面のほかの機能は使えるようにする
  try {
    contactList = await getAdminContacts();
  } catch (error) {
    console.error("お問い合わせ一覧の表示エラー:", error);
  }

  return (
    <section className="mt-10 border-t border-slate-200 pt-8">
      <h2 className="text-2xl font-semibold text-slate-800">
        お問い合わせ
        {contactList && (
          <span className="ml-3 text-base font-medium text-slate-600">
            未読 {contactList.unreadCount} 件
          </span>
        )}
      </h2>

      {!contactList && (
        <p role="alert" className="mt-6 text-red-700">
          お問い合わせを読み込めませんでした。少し待ってから再読み込みしてください。
        </p>
      )}

      {contactList?.contacts.length === 0 && (
        <p className="mt-6 text-slate-600">お問い合わせはまだありません。</p>
      )}

      {contactList && contactList.contacts.length > 0 && (
        <ul className="mt-6 grid gap-4">
          {contactList.contacts.map((contact) => (
            <li
              key={contact.id}
              className={`rounded-2xl border p-5 ${
                contact.isRead
                  ? "border-slate-200 bg-slate-50"
                  : "border-sky-300 bg-sky-50"
              }`}
            >
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                {/* 色だけに頼らず、文字でも状態を伝える */}
                <span
                  className={`rounded-full px-3 py-1 font-medium ${
                    contact.isRead
                      ? "bg-slate-200 text-slate-700"
                      : "bg-sky-700 text-white"
                  }`}
                >
                  {contact.isRead ? "既読" : "未読"}
                </span>

                <time dateTime={contact.createdAt}>
                  {formatContactDate(contact.createdAt)}
                </time>
              </div>

              <p className="mt-3 font-semibold break-words text-slate-800">
                {contact.name}
              </p>
              <p className="text-sm break-all text-slate-600">
                {contact.email}
              </p>

              {/* React が文字として表示するので、HTML は実行されない */}
              <p className="mt-3 break-words whitespace-pre-wrap text-slate-700">
                {contact.message}
              </p>

              <form action={updateContactRead} className="mt-4">
                <input type="hidden" name="id" value={contact.id} />
                <input
                  type="hidden"
                  name="isRead"
                  value={String(!contact.isRead)}
                />
                <button
                  type="submit"
                  className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                >
                  {contact.isRead ? "未読に戻す" : "既読にする"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
