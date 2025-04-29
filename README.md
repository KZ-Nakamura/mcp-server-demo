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
  - アクションプラン生成のためのプロンプト
  - 自動的に現在の日時情報が組み込まれます

### 4. schedule_generator
アクションプランをGoogleカレンダーにインポート可能なiCalendar形式に変換するツール
- 入力：
  - title：イベントのタイトル（必須）
  - date：イベントの日付（YYYY-MM-DD形式）（必須）
  - description：イベントの説明（オプション）
- 出力：
  - iCalendar形式のデータ（Googleカレンダーにインポート可能）
  - インポート方法の説明

## 機能の特徴

- **日時情報の自動取得**: アクションプラン生成時に自動的に現在の日時情報を取得し、プロンプトに組み込みます
- **シンプルなインターフェース**: 必要最小限の入力で使いやすいツールを提供します
- **カレンダー連携**: 生成したアクションをすぐにGoogleカレンダーに登録できます

## 記事

https://zenn.dev/loglass/articles/320812a6629a45