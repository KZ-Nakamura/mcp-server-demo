/**
 * JSONRPCリクエストメッセージ
 */
export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: number | string | null;
  method: string;
  params: Record<string, any>;
}

/**
 * JSONRPCレスポンスメッセージ
 */
export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: number | string;
  result?: any;
  error?: JsonRpcError;
}

/**
 * JSONRPCエラーオブジェクト
 */
export interface JsonRpcError {
  code: number;
  message: string;
  data?: any;
}
