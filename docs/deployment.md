# デプロイ手順書（akiko-portfolio）

本番環境の構成、作り直すときの手順、困ったときの確認先をまとめる。

> **秘密情報の扱い**
> 接続文字列・APIキー・秘密鍵は、各サービスの画面へ本人が直接入力する。
> このファイル・Issue・PR・チャットに値を書かない。スクリーンショットに写り込まないようにも注意する。

## 1. 本番の構成

```text
ブラウザ
  ↓
Vercel（Next.js）  https://akiko-portfolio-six.vercel.app
  ↓ INTERNAL_API_KEY を付けて呼ぶ
Render（Express）  https://akiko-portfolio-api.onrender.com
  ↓
Neon（PostgreSQL）

ログインの確認：Firebase Authentication
```

| サービス | 役割 | プラン | 本番になるブランチ |
| --- | --- | --- | --- |
| Vercel | 画面（`frontend`） | Hobby | `main` |
| Render | API（`backend`） | Free | `main` |
| Neon | データベース | Free | － |
| Firebase | 管理者の認証 | － | － |

Render の無料プランは、しばらくアクセスがないと停止する。次のアクセスでは起動に数十秒かかることがある。

## 2. ふだんの更新

```text
作業ブランチ → PR → CI が通る → main にマージ → 本番に自動で反映
```

- `main` へのマージが、そのまま本番に出る
- 環境変数を変えたときは、**再デプロイするまで反映されない**
  - Vercel：Deployments → 最新の Production の `⋯` → Redeploy
  - Render：環境変数の保存時に表示される案内に沿って再デプロイする
- DB の構造を変えたときは、Render の起動時に `prisma migrate deploy` が実行される

## 3. 環境を作り直す手順

上の層は下の層の URL が必要なので、**Neon → Render → Vercel** の順に進める。

### 3.1 Neon

1. プロジェクトを作成する（リージョン：Singapore）
2. **Connection pooling をオフ**にして、接続文字列をコピーする
3. `backend` で、接続先を Neon にしてテーブルを作る

```powershell
cd backend
$env:DATABASE_URL = "（Neon の接続文字列）"
npx prisma migrate deploy
Remove-Item Env:DATABASE_URL
```

接続文字列は `postgresql://` から始まる。先頭が欠けていると `P1013` エラーになる。

### 3.2 Render

Web Service を次の設定で作成する。

| 項目 | 値 |
| --- | --- |
| Runtime | Node |
| Region | Singapore |
| Branch | `main` |
| Root Directory | `backend` |
| Build Command | `npm ci --include=dev && npx prisma generate && npm run build` |
| Start Command | `npx prisma migrate deploy && npm start` |
| Health Check Path | `/health` |

環境変数：

| 名前 | 内容 |
| --- | --- |
| `DATABASE_URL` | Neon の接続文字列 |
| `INTERNAL_API_KEY` | Vercel と同じ値の合言葉 |
| `RESEND_API_KEY` | Resend の API キー（メール通知用） |
| `CONTACT_NOTIFICATION_TO` | 通知を受け取るメールアドレス（テスト用送信元では Resend の登録アドレス） |
| `CONTACT_NOTIFICATION_FROM` | 送信元。独自ドメインがない間は `onboarding@resend.dev` |
| `ADMIN_PAGE_URL` | 通知メールに載せる管理画面の URL（本番の `/admin/login`） |

メール通知の 4 つが未設定でも、お問い合わせの保存は動く。Render の無料プランは SMTP のポートを使えないため、HTTPS の API で送信する。

`INTERNAL_API_KEY` は、次のコマンドで作れる（出力はチャットなどに貼らない）。

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

確認：`https://<RenderのURL>/health` が 200 を返す。

### 3.3 Vercel

| 項目 | 値 |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | `frontend` |
| Production Branch | `main` |
| Node.js Version | `24.x` |

環境変数（Production）：

| 名前 | 内容 |
| --- | --- |
| `BACKEND_URL` | Render の URL |
| `INTERNAL_API_KEY` | Render と同じ値 |
| `FIREBASE_ADMIN_UID` | Firebase の管理者ユーザーの UID |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase のウェブアプリの設定 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | 同上 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | 同上 |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | 同上 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | 同上 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | 同上 |
| `FIREBASE_CLIENT_EMAIL` | サービスアカウントの `client_email` |
| `FIREBASE_PRIVATE_KEY` | サービスアカウントの `private_key`（`"` で囲まずに貼る） |

サービスアカウントの JSON ファイルは、リポジトリの中に置かない。

### 3.4 動作確認

- [ ] 公開画面にプロフィール・実績・スキル・画像が表示される
- [ ] 管理者ログインができる
- [ ] 管理画面で更新した内容が、公開画面に反映される
- [ ] お問い合わせを送信できる
- [ ] ログアウト後に `/admin` を開くと 404 になる
- [ ] スマートフォンの幅でも表示が崩れない

## 4. 困ったとき

まず **Vercel の Logs**（必要なら Render の Logs）で、エラーの全文を確認する。

| 症状・ログ | 原因 | 対応 |
| --- | --- | --- |
| ログインで 500、`ERR_REQUIRE_ESM`（`jose`・`jwks-rsa`） | firebase-admin 14 が使う部品を、Vercel で読み込めない | firebase-admin は 13 系を使う。14 に上げるときは Preview でログインを確認する |
| 保存で 500、`Express管理APIの処理に失敗しました: 401` | Vercel と Render の `INTERNAL_API_KEY` が違う | 同じ値に直して、Vercel を Redeploy する |
| マージしたのに本番が変わらない | Preview として作られている | Vercel の Production Branch が `main` か確認する |
| 環境変数を直したのに変わらない | 再デプロイしていない | Redeploy する |
| `P1013` | 接続文字列の形式が正しくない | `postgresql://` から始まっているか確認する |
| 最初の表示だけ遅い | Render が停止から起動している | 数十秒待つ（無料プランの仕様） |
| 通知メールが届かない、Render のログに `メール通知に失敗しました: 403` | テスト用送信元で、Resend の登録アドレス以外に送っている可能性 | `CONTACT_NOTIFICATION_TO` を確認する。迷惑メールも確認する |
| Render のログに `メール通知の環境変数が未設定` | 通知用の環境変数が足りない | Render の 4 つの環境変数を確認して再デプロイする |

## 5. 合言葉（INTERNAL_API_KEY）を作り直すとき

1. 3.2 のコマンドで新しい値を作る
2. Render の値を更新して、再デプロイする
3. Vercel の値を同じものに更新して、Redeploy する
4. 管理画面での保存と、お問い合わせの送信を確認する

2 と 3 の間は値が一致しないため、管理画面の保存とお問い合わせが一時的に失敗する。
