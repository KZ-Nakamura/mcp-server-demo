import { Logger } from './logger.js';
import { Server } from './server.js';
import { Stdio } from './stdio.js';
import { generateMockActionPlan, getActionPlanPrompt } from './prompts/actionPlanner.js';
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

  // アイディアプランナーツール（プロンプト生成）を登録
  server.registerTool({
    name: 'idea_planner',
    description: 'ユーザーのアイディアからアクションプランを生成するためのプロンプトを生成するツール',
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
      // プロンプトテンプレートを取得（コメントアウトを切り替えて使い分け可能）
      const prompt = getActionPlanPrompt(args.idea, args.context);
      // const prompt = generateMockActionPlan(args.idea, args.context).join("\n");
      
      return {
        content: [
          { type: "text", text: "## 以下のプロンプトを実行してください\n\n```\n" + prompt + "\n```" }
        ]
      };
    }
  });

  // スケジュール生成ツールを登録
  server.registerTool({
    name: 'schedule_generator',
    description: 'アクションプランからGoogleカレンダーにインポート可能なスケジュールを生成するツール',
    inputSchema: {
      type: 'object',
      properties: {
        actions: {
          type: 'array',
          description: 'アクションプランのリスト',
          items: {
            type: 'string'
          }
        },
        startDate: {
          type: 'string',
          description: '開始日（YYYY-MM-DD形式、オプション）'
        }
      },
      required: ['actions']
    },
    execute: async (args: { actions: string[], startDate?: string }) => {
      // 開始日が指定されている場合は変換
      let startDateObj: Date | undefined = undefined;
      if (args.startDate) {
        startDateObj = new Date(args.startDate);
      }
      
      // モック実装を使用
      const actionSchedule = generateMockSchedule(args.actions, startDateObj);
      
      return {
        content: [
          { type: "text", text: "## アクションスケジュール（iCalendar形式）\n\n" + actionSchedule }
        ]
      };
    }
  });

  // サーバーの起動
  server.start();
  Logger.info('MCP Server started');
}

main();
