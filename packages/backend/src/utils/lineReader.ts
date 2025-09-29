import readline from 'readline';
import type { Readable } from 'stream';

export async function processLines(
  stream: Readable,
  onLine: (line: string) => Promise<void> | void,
): Promise<void> {
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  for await (const line of rl) {
    await onLine(line);
  }
}
