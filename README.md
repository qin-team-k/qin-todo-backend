# Qin Todo Backend by Team-k

Qin Todo のバックエンドレポジトリ by Team-k

## 使用技術

| 機能                                          | 備考                                                                                                                                                 |
| :-------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| [NestJS](https://github.com/nestjs/nest)      | Web サーバーとしてのロジックの実装をより素早く、テストしやすく作ることを目指したフレームワーク。すべての機能は TypeScript での記述をサポートしている |
| [TypeScript](https://www.typescriptlang.org/) | マイクロソフトが開発した JavaScript を拡張して作られたオープンソースのプログラミング言語                                                             |
| [Jest](https://jestjs.io/ja/)                 | JavaScript のテスティングフレームワーク                                                                                                              |
| [ESLint](https://eslint.org/)                 | コードを分析し問題点を指摘してくれるツール                                                                                                           |
| [Prettier](https://prettier.io/)              | 改行やクォーテーションなどを統一できるコードフォーマッター                                                                                           |
| [PlanetScale](https://planetscale.com/)       | MySQL 互換のサーバーレスデータベース                                                                                                                 |
| [Docker](https://www.docker.com/)             | コンテナ仮想化を用いてアプリケーションを開発・配置・実行するためのオープンソースソフトウェア                                                         |

## ライブラリ一覧

| 機能                                                                | 説明                                                                                                                                   |
| :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------- |
| [Prisma](https://www.prisma.io/)                                    | Node.js と TypeScript のための、オープンソースの次世代 ORM                                                                             |
| [class-validator](https://github.com/typestack/class-validator)     | デコレーターベースと非デコレーターベースのバリデーションを使用できるようにする                                                         |
| [class-transformer](https://github.com/typestack/class-transformer) | プレーンなオブジェクトをクラスのインスタンスに変換したり、逆にクラスのインスタンスをプレーンなオブジェクトに変換したりすることができる |

## セットアップ

```
# .envの作成
echo 'DATABASE_URL="mysql://root:password@localhost:3306/qin-todo"' > .env

# 依存パッケージのインストール & prisma.schemaの情報を反映
yarn pre:all

# api/dbの起動
yarn run docker:up

# 開発環境の起動
yarn run start:dev

# セットアップ確認
curl --location --request GET 'http://localhost:3000/healthcheck'

# api/dbの終了
yarn run docker:down
```

## テスト実行

```bash
# unit tests
yarn run test

# e2e tests
yarn run test:e2e

# test coverage
yarn run test:cov
```

## 開発する

### Git ブランチルール

master

- 本番のブランチです。ここにマージすると本番に自動反映されます。基本的にはこのブランチでは作業はしません。

develop

- 本番反映前に確認するための環境（ステージング環境）。
- 常駐しているブランチで作業ブランチからの変更を受けつけ、ここから `master` にマージします。

feature/[対応する issue 番号]-[作業の概要]

- 開発にはここを用いる。
- 必ず develop から分岐し、develop にマージする。

### ディレクトリ構成（サンプル）

```
.
├── e2e
│   ├── todo
│   │   └── todo.e2e-spec.ts
│   └── jest-e2e.json
├── jest.json
├── package-lock.json
├── package.json
├── src
│   ├── app.module.ts
│   ├── api
│   │   └──todo
│   │       ├── todo.controller.spec.ts
│   │       ├── todo.controller.ts
│   │       ├── todo.module.ts
│   │       ├── todo.service.ts
│   │       ├── dto
│   │       │   └── create-todo.dto.ts
│   │       └── interfaces
│   │           └── todo.interface.ts
│   ├── common
│   │   ├── decorators
│   │   │   └── roles.decorator.ts
│   │   ├── filters
│   │   │   └── http-exception.filter.ts
│   │   ├── guards
│   │   │   └── roles.guard.ts
│   │   ├── interceptors
│   │   │   ├── exception.interceptor.ts
│   │   │   └── timeout.interceptor.ts
│   │   ├── middleware
│   │   │   └── logger.middleware.ts
│   │   └── pipes
│   │       ├── parse-int.pipe.ts
│   │       └── validation.pipe.ts
│   ├── core
│   │   ├── core.module.ts
│   │   └── interceptors
│   │       ├── logging.interceptor.ts
│   │       └── transform.interceptor.ts
│   └── main.ts
├── tsconfig.build.json
└── tsconfig.json
```
