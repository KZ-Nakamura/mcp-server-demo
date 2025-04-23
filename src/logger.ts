export class Logger {
  /**
   * Infoログを出力
   */
  static info(message: string): void {
    process.stderr.write(`ℹ️ ${message}\n`);
  }
}
