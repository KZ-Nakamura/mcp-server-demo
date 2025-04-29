# Sample MCP Server

## 概要

SDKを使用しない簡易なMCPサーバーのサンプルコードです。

## 動作確認方法

```bash
npx tsc && npx @modelcontextprotocol/inspector
```

Command: `node`
Arguments: `dist/index.js`

## ローカルでMCPサーバーを立てる方法

### 準備

1. 必要なパッケージをインストールします
```bash
npm install
```

### ビルドと起動

1. TypeScriptコードをコンパイルします
```bash
npm run build
```

2. サーバーを起動します
```bash
npm start
```

サーバーが正常に起動すると「ℹ️ MCP Server started」というメッセージが表示されます。
サーバーを終了するには Ctrl+C を押してください。

## 実装されているツール

### 1. count
文字数をカウントするシンプルなツール

### 2. idea_planner
ユーザーのアイディアからアクションプランとスケジュールを生成するツール
- 入力：
  - idea：ユーザーのアイディア（必須）
  - context：コンテキスト情報（オプション）
- 出力：
  - アクションプランのリスト
  - iCalendar形式のアクションスケジュール（Googleカレンダーにインポート可能）

## 記事

https://zenn.dev/loglass/articles/320812a6629a45