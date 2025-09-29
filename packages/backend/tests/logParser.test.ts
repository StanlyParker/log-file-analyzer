import { describe, it, expect } from 'vitest';
import { LogParserService } from '../src/services/logParserService';;
import { Readable } from 'stream';

describe('LogParserService', () => {
    it('parses simple logs', async () => {
        const text = [
            '2023-01-01T00:00:00Z INFO Starting service',
            '2023-01-01T00:00:01Z ERROR Something failed',
            '2023-01-01T00:00:02Z WARN Disk almost full',
            '2023-01-01T00:00:03Z INFO Starting service',
            'Random line without timestamp'
        ].join('\n');
        const stream = Readable.from([text]);
        const parser = new LogParserService();
        const stats = await parser.parseStream(stream);
        expect(stats.totalLines).toBe(5);
        expect(stats.levelCounts.INFO).toBeGreaterThanOrEqual(2);
        expect(stats.levelCounts.ERROR).toBe(1);
        expect(stats.topMessages.length).toBeGreaterThan(0);
        expect(stats.timeFrame).not.toBeNull();
    });
});