import type {AngpaoRainLocale, DrawResult} from './types';

/** Suffix of the language-specific image files, e.g. `btn-start-en.png` / `btn-start-cn.png` */
export type ArtworkLang = 'en' | 'cn';

export const DEFAULT_LOCALE: AngpaoRainLocale = 'en-US';

export const FONT_FAMILY = '"Plus Jakarta Sans", "Times New Roman", Tahoma, serif';

/** Number of prize artworks (result-angpao-01 … 13), which is also the number of summary slots */
export const PRIZE_TYPE_COUNT = 13;

export const EMPTY_DRAW_RESULT: DrawResult = {counts: [], result: 0};

export interface GameOptions {
    baseSpeed: number
    minSpeedOffset: number
    maxSpeedOffset: number
    incrementRatio: number
    totalTime: number
    basketSpeed: number
    scaleRatio: number
}

export const defaultGameOptions: GameOptions = {
    baseSpeed: 10,
    minSpeedOffset: 0,
    maxSpeedOffset: 8,
    incrementRatio: 1.0001,
    totalTime: 10,
    basketSpeed: 15,
    scaleRatio: 0.5,
};

/**
 * Map a locale to the suffix of the image files.
 * `'zh-CN'` → `'cn'`; `'en-US'`, or any unsupported value passed from untyped code → `'en'`
 */
export const localeToArtworkLang = (locale: AngpaoRainLocale = DEFAULT_LOCALE): ArtworkLang => {
    return locale === 'zh-CN' ? 'cn' : 'en';
};

export const defaultFormatAmount = (value: number | string) => `RM ${value}`;

/** Remaining time shown under the timer bar, in whole seconds: `5` → `'05s'`, `90` → `'90s'` */
export const formatRemainingTime = (seconds: number) => `${String(Math.max(0, seconds)).padStart(2, '0')}s`;

/** Make sure whatever `onDraw` returned can be rendered without crashing the scene */
export const normalizeDrawResult = (value: unknown): DrawResult => {
    if (!value || typeof value !== 'object') return EMPTY_DRAW_RESULT;
    const {counts, result} = value as Partial<DrawResult>;
    return {
        counts: Array.isArray(counts)
            ? counts
                .filter(row => row && Number.isInteger(row.type) && row.type >= 0 && row.type < PRIZE_TYPE_COUNT)
                .slice(0, PRIZE_TYPE_COUNT)
            : [],
        result: typeof result === 'number' || typeof result === 'string' ? result : 0,
    };
};
