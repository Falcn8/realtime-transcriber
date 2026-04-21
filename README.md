# リアルタイム文字起こし

ブラウザでそのまま使える、シンプルなリアルタイム文字起こしアプリです。
授業、ゼミ、会議などの文字起こしを同時進行で表示し、全体をダウンロードすることも可能です。

デモ: [https://transcribe.hexagon.one/](https://transcribe.hexagon.one/)

## 主な機能

- リアルタイム字幕表示
- 確定テキストのログ保存
- テキストファイルとしてダウンロード
- 言語の切り替え
- 全画面表示、文字サイズ、行間の調整
- Safari 向けローカル文字起こしフォールバック（Whisper）

## Safari 対応について

- Chrome / Edge: ブラウザ内の音声認識 API を使用
- Safari: `MediaRecorder` + ブラウザ内 Whisper（Transformers.js / WASM）を使用

このフォールバックは OpenAI API を使わないため、API 課金は発生しません。
初回はモデルのダウンロードに時間がかかる場合があります。

## ローカル環境

```bash
vercel dev
```

## デプロイ

```bash
vercel --prod
```

## 推奨ブラウザ

- Chrome
- Edge
- Safari
