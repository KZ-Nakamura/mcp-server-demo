/**
 * スケジュール生成用のプロンプトテンプレート
 */

/**
 * スケジュール生成のためのプロンプトテンプレート
 * @param actions アクションプランのリスト 
 * @param startDate 開始日（オプション）
 * @returns テンプレート文字列
 */
export function getScheduleGeneratorPrompt(actions: string[], startDate?: Date): string {
  const start = startDate || new Date(Date.now() + 24 * 60 * 60 * 1000); // デフォルトは明日
  
  return `
あなたはアクションプランを効果的なスケジュールに変換する専門家です。
以下のアクションステップを分析し、現実的な時間枠で実行できるスケジュールを作成してください。

## アクションステップ
${actions.join('\n')}

## 開始日
${start.toISOString().split('T')[0]}

## 指示
- アクションステップの難易度と依存関係を考慮してスケジュールを組んでください
- 各アクションに対して、適切な所要時間（時間単位）を設定してください
- 平日は1日最大4時間、週末は1日最大6時間の作業を想定してください
- カレンダーに登録できるiCalendar形式のスケジュールを生成してください

## 出力形式
iCalendar形式のスケジュールのみを出力してください。余計な説明は不要です。
`.trim();
}

/**
 * モック用のスケジュールを生成
 * @param actions アクションプランのリスト
 * @param startDate 開始日（オプション） 
 * @returns iCalendar形式の文字列
 */
export function generateMockSchedule(actions: string[], startDate?: Date): string {
  // 実際の実装では、LLMを使ってアクションに基づいて適切なスケジューリングを行う
  const now = new Date();
  const start = startDate || new Date(now);
  start.setDate(start.getDate() + 1); // デフォルトは明日から開始
  
  const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MCP Server//NONSGML Idea Planner//JA
${actions.map((action, index) => {
  const eventDate = new Date(start);
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