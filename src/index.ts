import { Logger } from './logger.js';
import { Server } from './server.js';
import { Stdio } from './stdio.js';
import { generateMockActionPlan } from './prompts/actionPlanner.js';
import { generateMockSchedule } from './prompts/scheduleGenerator.js';

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

  // アイディアプランナーツールを登録
  server.registerTool({
    name: 'idea_planner',
    description: 'ユーザーのアイディアからアクションプランとスケジュールを生成するツール',
    inputSchema: {
      type: 'object',
      properties: {
        idea: {
          type: 'string',
          description: 'ユーザーのアイディア'
        },
        context: {
          type: 'string',
          description: 'コンテキスト情報（オプション）'
        }
      },
      required: ['idea']
    },
    execute: async (args: { idea: string, context?: string }) => {
      // モック実装を使用
      const actionPlan = generateMockActionPlan(args.idea, args.context);
      const actionSchedule = generateMockSchedule(actionPlan);
      
      return {
        content: [
          { type: "text", text: "## アクションプラン\n\n" + actionPlan.join("\n") },
          { type: "text", text: "\n\n## アクションスケジュール（iCalendar形式）\n\n" + actionSchedule }
        ]
      };
    }
  });

  // サーバーの起動
  server.start();
  Logger.info('MCP Server started');
}

main();
