# Akiko Portfolio

管理画面からプロフィール、実績、スキル、画像を編集できるポートフォリオサイトです。

## 制作目的

これまでの仕事で培ったコミュニケーション力と、現在学習しているWeb開発・AWSの知識を紹介するために制作しています。

## 主な機能

- プロフィール表示
- 実績の表示
- スキルの表示
- 問い合わせフォーム
- Firebase Authenticationによる管理者認証
- 管理画面からのコンテンツ管理
- 画像の登録・更新
- 未認証で管理画面へアクセスした場合の404応答

## 使用技術

### フロントエンド

- TypeScript
- Next.js（App Router）
- Tailwind CSS

### バックエンド

- TypeScript
- Express
- Prisma

### データベース

- PostgreSQL
- Docker

### 認証

- Firebase Authentication

## ディレクトリ構成

```text
akiko-portfolio
├─ frontend
├─ backend
└─ docker-compose.yml
```

## 現在の進捗

- [x] Next.jsの初期設定
- [x] Expressの初期設定
- [x] PostgreSQLの起動
- [x] Prismaの導入
- [x] データベースの初期マイグレーション
- [ ] トップページ作成
- [ ] 問い合わせフォーム作成
- [ ] Firebase認証
- [ ] 管理画面作成
- [ ] 画像登録・更新