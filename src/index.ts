import { Logger } from './logger.js';
import { Server } from './server.js';
import { Stdio } from './stdio.js';

async function main() {
    // サーバーを起動
    startServer();
}

/**
 * MCPサーバーを起動
 */
function startServer() {
  // Transportインスタンスを作成
  const transport = new Stdio();
  
  // Serverインスタンスを作成
  const server = new Server(
    { name: 'MCP Server', version: '0.0.1' },
    { 
      instructions: 'This is a simple implementation of an MCP server using stdio transport.',
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {
          listChanged: true
        },
      },
    },
    transport
  );

  // ツールの登録
  server.registerTool({ // <-- 追加
    name: 'count',
    description: '文字数をカウントするツール',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: '文字数をカウントしたいテキスト'
        }
      },
      required: ['text']
    },
    execute: async (args: { text: string }) => {
      return { content: [{ type: "text", text: args.text.length.toString() }] };
    }
  });

  // サーバーの起動
  server.start();
  Logger.info('MCP Server started');
}

main();
