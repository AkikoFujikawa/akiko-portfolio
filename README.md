# Akiko Portfolio

管理画面からコンテンツを管理できる、ポートフォリオサイトです。

Next.js、Express、Prisma、PostgreSQLを使用して制作しています。

## 制作目的

これまでの仕事で培ったコミュニケーション力と、現在学習しているWeb開発の知識を紹介するために制作しています。

## 実装済みの機能

- プロフィール、実績、スキルの表示
- PostgreSQLに保存したデータのトップページへの反映
- Expressによるプロフィール・実績・スキルのCRUD API
- Next.jsのサーバー機能からExpress APIへのアクセス
- Firebase AuthenticationによるGoogleログイン
- Firebase Admin SDKによるサーバー認証
- セッションCookieによるログイン状態の管理
- 管理者UIDによるアクセス制限
- 未認証で管理画面へアクセスした場合の404応答
- 管理画面からのプロフィール編集
- 管理画面から指定した見出しの改行をトップページへ反映
- 管理画面からのスキル登録
- 内部APIキーによるExpress管理APIの保護
- ログアウト

## 実装予定の機能

- 管理画面からの実績登録・編集
- 画像の登録・更新
- 画像データのデータベース保存
- お問い合わせフォーム

## 使用技術

### フロントエンド

- TypeScript
- Next.js 16（App Router）
- React
- Tailwind CSS

### バックエンド

- TypeScript
- Express
- Prisma

### データベース

- PostgreSQL 16
- Docker

### 認証

- Firebase Authentication
- Firebase Admin SDK

## ディレクトリ構成

```text
akiko-portfolio
├─ frontend          # Next.js
├─ backend           # Express・Prisma
├─ docker-compose.yml
└─ README.md
```

## データの流れ

1. 利用者がNext.jsの画面へアクセスします。
2. Next.jsのサーバー機能がExpress APIへアクセスします。
3. ExpressがPrismaを使ってPostgreSQLのデータを取得・保存します。
4. 取得したプロフィール・実績・スキルをトップページへ表示します。

## 現在の進捗

- [x] Next.jsの初期設定
- [x] Expressの初期設定
- [x] PostgreSQLのDocker環境作成
- [x] Prismaの導入とマイグレーション
- [x] トップページ作成
- [x] Firebase認証
- [x] 管理者だけがアクセスできる管理画面
- [x] プロフィール・実績・スキルのCRUD API
- [x] Next.jsとExpressの接続
- [x] トップページへのDBデータ表示
- [x] 管理画面からのスキル登録
- [x] 管理画面からのプロフィール編集
- [x] 管理画面からの実績管理
- [x] 画像登録・更新
- [x] お問い合わせフォーム

## 環境変数について

Firebaseの設定、データベース接続情報、内部APIキーなどの秘密情報は環境変数で管理しています。

`.env`と`.env.local`はGitの管理対象外にしており、GitHubには登録していません。