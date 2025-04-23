import { JsonRpcRequest, JsonRpcResponse } from "./types";

/**
 * MCPプロトコル実装
 * JSON-RPCメッセージの処理を担当
 */
export class Protocol {
  /**
   * リクエストハンドラのマップ
   */
  private handlers: Map<string, (params: any) => Promise<any>> = new Map();

  /**
   * プロトコル処理を初期化
   */
  constructor(private sendCallback: (message: JsonRpcResponse) => void) {}
  
  /**
   * リクエストハンドラを登録
   */
  public registerHandler(method: string, handler: (params: any) => Promise<any>): void {
    this.handlers.set(method, handler);
  }

  /**
   * メッセージを受信して処理
   */
  public async processRequest(message: any): Promise<void> {
    const request = message as JsonRpcRequest;
    const handler = this.handlers.get(request.method);
    if (!handler) {
      return;
    }
    // ハンドラの実行
    const result = await handler(request.params);
    if (request.id !== null) {
      this.sendResponse(request.id, result);
    }
  }

  /**
   * 成功レスポンスを送信
   */
  private sendResponse(id: number | string, result: any): void {
    const response: JsonRpcResponse = {
      jsonrpc: '2.0',
      id,
      result
    };
    this.sendCallback(response);
  }
} 
