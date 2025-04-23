import { Transport } from './transport.js';
import { Protocol } from './protocol';

/**
 * サーバー初期化パラメータ
 */
export interface ServerOptions {
  instructions?: string;
  capabilities: Record<string, any>;
  protocolVersion: string;
}

/**
 * MCPサーバー情報
 */
export interface ServerInfo {
  name: string;
  version: string;
}

/**
 * ツールの定義
 */
export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  execute: (args: any) => Promise<any>;  // CallToolResult
}

/**
 * MCPサーバーの基本実装
 */
export class Server {
  private protocol: Protocol;
  private tools: Tool[] = []; 

  constructor(
    private readonly serverInfo: ServerInfo, 
    private readonly options: ServerOptions,
    private transport: Transport
  ) {
    // プロトコル層を初期化
    this.protocol = new Protocol(this.transport.sendMessage.bind(this.transport));

    // トランスポートの初期化
    transport.setMessageHandler(async (message: any) => { // <-- 追加
      await this.protocol.processRequest(message);
    });
        
    // メソッドを登録
    this.registerMethods();
  }

  /**
   * サーバーを起動し、メッセージの待ち受けを開始
   */
  public start(): void {
    this.transport.start();
  }

  /**
   * ツールを登録する
   */
  public registerTool(tool: Tool): void {
    this.tools.push(tool);
  }

  /**
   * メソッドを登録
   */
  private registerMethods(): void {
    // 初期化ハンドラを登録
    this.protocol.registerHandler('initialize', this.handleInitialize.bind(this));
    // 初期化完了通知ハンドラを登録
    this.protocol.registerHandler('notifications/initialized', this.handleInitialized.bind(this));
    // ツール関連ハンドラを登録
    this.protocol.registerHandler('tools/list', this.handleToolsList.bind(this));
    this.protocol.registerHandler('tools/call', this.handleToolCall.bind(this));
  }

  /**
   * initializeリクエストのハンドラ
   */
  private async handleInitialize(): Promise<any> {
    return {
      protocolVersion: this.options.protocolVersion,
      serverInfo: this.serverInfo,
      capabilities: this.options.capabilities,
      instructions: this.options.instructions
    };
  }

  /**
   * initialized通知を処理するハンドラ
   */
  private async handleInitialized(): Promise<void> {
    // 何もしない
  }

  /**
   * tools/listリクエストを処理するハンドラ
   */
  private async handleToolsList(): Promise<any> {
    // 利用可能なツール一覧を返す
    return { tools: this.tools };
  }

  /**
   * tools/callリクエストを処理するハンドラ
   */
  private async handleToolCall(params: any): Promise<any> {
    const { name, arguments: args } = params;
    // ツールを検索
    const tool = this.tools.find(t => t.name === name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }
    // ツール実行
    return await tool.execute(args);
  }
}
