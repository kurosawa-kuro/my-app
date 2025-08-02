# My App

AIチャット、ファイル管理、プロンプト管理機能を備えたNext.jsアプリケーション

## 機能

- AIチャット（OpenAI、Claude、DeepSeek対応）
- ファイル管理
- プロンプト管理
- Webスクレイピング

## セットアップ

1. 依存関係をインストール
```bash
npm install
```

2. 環境変数を設定
```bash
cp env.example .env.local
# .env.localファイルを編集してAPIキーを設定
```

3. 開発サーバーを起動
```bash
npm run dev
```

## 環境変数

- `OPENAI_API_KEY`: OpenAI APIキー
- `CLAUDE_API_KEY`: Claude APIキー
- `DEEPSEEK_API_KEY`: DeepSeek APIキー
- `NEXTAUTH_SECRET`: NextAuth.jsのシークレット
- `NEXTAUTH_URL`: NextAuth.jsのURL

## セキュリティ

- APIキーは環境変数で管理
- .env.localファイルは.gitignoreで除外
- 機密情報はリポジトリにコミットしない 