/**
 * スケジュール生成モジュール
 */

/**
 * イベント情報の型定義
 */
export interface CalendarEvent {
  title: string;
  date: string; // YYYY-MM-DD形式
  startTime: string; // HH:MM形式 
  endTime: string; // HH:MM形式
  location?: string;
  description?: string;
}

/**
 * GoogleカレンダーでインポートできるiCalendar形式に変換
 * @param event イベント情報
 * @returns iCalendar形式のテキスト
 */
export function generateICalendar(event: CalendarEvent): string {
  // 日付と時間をiCalendar形式に変換
  const dtStart = formatDateTimeToICalendar(event.date, event.startTime);
  const dtEnd = formatDateTimeToICalendar(event.date, event.endTime);
  const now = formatDateTimeToICalendar(new Date().toISOString().split('T')[0], 
    new Date().toTimeString().split(' ')[0].substring(0, 5));
  
  // ユニークIDの生成
  const uid = `${Date.now()}@mcpserver`;
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MCP Server//NONSGML Event Generator//JA
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${event.title}
${event.location ? `LOCATION:${event.location}` : ''}
${event.description ? `DESCRIPTION:${event.description}` : ''}
END:VEVENT
END:VCALENDAR`;
}

/**
 * 日付と時間をiCalendar形式に変換する
 * @param date YYYY-MM-DD形式の日付
 * @param time HH:MM形式の時間
 * @returns iCalendar形式の日時文字列
 */
function formatDateTimeToICalendar(date: string, time: string): string {
  // スペースや区切り文字を削除
  const cleanDate = date.replace(/[-:]/g, '');
  const cleanTime = time.replace(/[-:]/g, '');
  
  // YYYYMMDDTHHMMSSZ 形式に変換
  return `${cleanDate}T${cleanTime}00Z`;
}

/**
 * モック用のスケジュール生成関数
 * アイディアプランナーからの出力を受け取ってiCalendar形式に変換
 * @param title イベントのタイトル
 * @param actionDate イベントの日付 (YYYY-MM-DD形式)
 * @param description 説明文（オプション）
 * @returns iCalendar形式の文字列
 */
export function generateMockSchedule(title: string, actionDate: string, description?: string): string {
  // デフォルト値を設定
  const event: CalendarEvent = {
    title: title,
    date: actionDate,
    startTime: "14:00",
    endTime: "16:00",
    location: "オフィス",
    description: description || "自動生成されたイベント"
  };
  
  return generateICalendar(event);
} 