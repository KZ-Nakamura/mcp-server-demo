import { MessageHandler, Transport } from './transport.js';

export class Stdio implements Transport {
  private messageHandler?: MessageHandler;

  /**
   * メッセージ受信ハンドラを設定
   */
    public setMessageHandler(handler: MessageHandler): void {
      this.messageHandler = handler;
    }

  /**
   * MCPメッセージを送信
   */
  public sendMessage(message: any): void {
    const json = JSON.stringify(message);
    process.stdout.write(json + '\n');
  }
  
  /**
   * トランスポートを開始し、メッセージの受信を開始
   */
  public start(): void {
    this.setupMessageReceiver();
  }

  /**
   * メッセージ受信機能をセットアップ
   * 標準入力から改行で区切られたJSONメッセージを受信
   */
  private setupMessageReceiver(): void {
    let buffer = '';
    
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk: string) => {
      buffer += chunk;

      let lineEnd;
      // 改行があるまでバッファを読み込む
      while ((lineEnd = buffer.indexOf('\n')) !== -1) {
        // 改行を削除
        const line = buffer.substring(0, lineEnd).replace(/\r$/, '');
        buffer = buffer.substring(lineEnd + 1);

        // 空行は無視
        if (line.trim().length == 0) {
            continue;
        }

        const message = JSON.parse(line);
        if (this.messageHandler) {
            this.messageHandler(message)
        }
      }
    });
  }
}
