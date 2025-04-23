export interface Transport {
  /**
   * メッセージ受信ハンドラを設定
   */
  setMessageHandler(handler: MessageHandler): void;
  
  /**
   * MCPメッセージを送信
   */
  sendMessage(message: any): void;
  
  /**
   * トランスポートを開始
   */
  start(): void;
}

/**
 * メッセージを受信するハンドラの型定義
 */
export type MessageHandler = (message: any) => Promise<void>;
