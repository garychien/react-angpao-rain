import {EMPTY_DRAW_RESULT, formatRemainingTime, localeToArtworkLang, normalizeDrawResult} from './config';
import type {AngpaoRainLocale} from './types';

describe('localeToArtworkLang', () => {
    it.each([
        ['en-US', 'en'],
        ['zh-CN', 'cn'],
        [undefined, 'en'],
    ])('%s → %s', (locale, expected) => {
        expect(localeToArtworkLang(locale as AngpaoRainLocale | undefined)).toBe(expected);
    });

    it('falls back to en-US for unsupported values from untyped code', () => {
        expect(localeToArtworkLang('zh-TW' as AngpaoRainLocale)).toBe('en');
        expect(localeToArtworkLang('cn' as AngpaoRainLocale)).toBe('en');
    });
});

describe('normalizeDrawResult', () => {
    it('falls back to an empty result for invalid values', () => {
        expect(normalizeDrawResult(null)).toEqual(EMPTY_DRAW_RESULT);
        expect(normalizeDrawResult(undefined)).toEqual(EMPTY_DRAW_RESULT);
        expect(normalizeDrawResult('oops')).toEqual(EMPTY_DRAW_RESULT);
    });

    it('keeps valid rows and drops unknown prize types', () => {
        const result = normalizeDrawResult({
            counts: [{type: 0, amount: 3}, {type: 13, amount: 1}, {type: -1, amount: 1}, {type: 1.5, amount: 1}, {type: 12, amount: '5'}],
            result: 88,
        });
        expect(result).toEqual({counts: [{type: 0, amount: 3}, {type: 12, amount: '5'}], result: 88});
    });

    it('shows at most 13 rows', () => {
        const counts = Array.from({length: 20}, () => ({type: 1, amount: 1}));
        expect(normalizeDrawResult({counts, result: 1}).counts).toHaveLength(13);
    });

    it('defaults a missing total to 0', () => {
        expect(normalizeDrawResult({counts: []}).result).toBe(0);
    });
});

describe('formatRemainingTime', () => {
    it.each([
        [90, '90s'],
        [60, '60s'],
        [10, '10s'],
        [5, '05s'],
        [0, '00s'],
        [-1, '00s'],
        [125, '125s'],
    ])('%i → %s', (seconds, expected) => {
        expect(formatRemainingTime(seconds)).toBe(expected);
    });
});
