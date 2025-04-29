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
      // モック実装
      const actionPlan = generateActionPlan(args.idea, args.context);
      const actionSchedule = generateActionSchedule(actionPlan);
      
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

/**
 * アイディアからアクションプランを生成する（モック実装）
 */
function generateActionPlan(idea: string, context?: string): string[] {
  // 実際の実装では、LLMを使ってアイディアを分析し、具体的なアクションに分解する
  return [
    "1. アイディアの詳細を文書化する",
    "2. 必要なリソースをリストアップする",
    "3. 主要なステークホルダーを特定する",
    "4. タイムラインを作成する",
    "5. リスク分析を実施する"
  ];
}

/**
 * アクションプランからiCalendar形式のスケジュールを生成する（モック実装）
 */
function generateActionSchedule(actions: string[]): string {
  // 実際の実装では、アクションに基づいて適切なスケジューリングを行い、
  // iCalendar形式の文字列を生成する
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() + 1); // 明日から開始
  
  const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MCP Server//NONSGML Idea Planner//JA
${actions.map((action, index) => {
  const eventDate = new Date(startDate);
  eventDate.setDate(eventDate.getDate() + index); // 1日ずつずらす
  
  const dateStr = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dateEnd = new Date(eventDate);
  dateEnd.setHours(dateEnd.getHours() + 2); // 各タスク2時間と仮定
  const dateEndStr = dateEnd.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  return `BEGIN:VEVENT
UID:${Date.now()}${index}@mcpserver
DTSTAMP:${dateStr}
DTSTART:${dateStr}
DTEND:${dateEndStr}
SUMMARY:${action}
END:VEVENT`;
}).join('\n')}
END:VCALENDAR`;

  return icalContent;
}

main();
