import type {THEME_IMAGE_SPEC} from './themes/spec';

/** Language of the in-game image text. Only English and Simplified Chinese artwork exists. */
export type AngpaoRainLocale = 'en-US' | 'zh-CN';

/** One row of the prize breakdown shown on the summary screen. */
export interface DrawCount {
    /** Prize artwork index, 0 – 12 (maps to the 13 bundled result-angpao images) */
    type: number
    /** Amount shown next to the artwork, e.g. `x5` */
    amount: number | string
}

/** What `onDraw` must resolve with. */
export interface DrawResult {
    /** Breakdown shown on the summary screen. At most 13 entries are displayed. */
    counts: DrawCount[]
    /** Total prize shown on the result screen, passed through `formatAmount` */
    result: number | string
}

/** Sent to `onDraw` once the timer runs out. */
export interface DrawRequest {
    /** Number of angpao caught */
    score: number
}

export interface GameOverInfo {
    /** Number of angpao caught */
    score: number
    /** Seconds played */
    time: number
}

export interface AngpaoRainCallbacks {
    /**
     * Called when the round ends. Resolve with the prize to show (e.g. by calling your backend).
     * If it rejects, `onError` is called and an empty result is shown. If it resolves with a
     * malformed result, `onError` is called too and the valid part is shown.
     */
    onDraw: (request: DrawRequest) => Promise<DrawResult>
    /** The player pressed the "receive" button on the result screen */
    onClaim?: (result: DrawResult) => void
    /** The player pressed the close button on the title screen */
    onClose?: () => void
    /** The timer ran out, before `onDraw` is called */
    onGameOver?: (info: GameOverInfo) => void
    /**
     * `onDraw` rejected or resolved with a malformed result, or the theme's images are incomplete
     * or failed to load. Without it, errors are logged with `console.error`.
     */
    onError?: (error: unknown) => void
}

export interface AngpaoRainProps extends AngpaoRainCallbacks {
    /** Language of the in-game artwork. Default `'en-US'` */
    locale?: AngpaoRainLocale
    /** Round length in seconds. Default 10 */
    duration?: number
    /** Formats the total prize on the result screen. Default `(v) => \`RM ${v}\`` */
    formatAmount?: (value: number | string) => string
    /**
     * Artwork of the game. Default `defaultTheme`.
     * Define themes at module level: a new theme object restarts the game.
     */
    theme?: AngpaoRainTheme
    /** Logical game width. Default 450 */
    width?: number
    /** Logical game height. Default 800 */
    height?: number
    className?: string
    style?: React.CSSProperties
}

/** File name of every image a theme provides, e.g. `'angpao.png'`. Sizes are listed in `THEME_IMAGE_SPEC`. */
export type AngpaoRainImageFile = keyof typeof THEME_IMAGE_SPEC;

/** Image URLs keyed by file name. Any URL works: imported files (data URIs), `/public` paths, a CDN … */
export type AngpaoRainThemeImages = Record<AngpaoRainImageFile, string>;

export interface AngpaoRainThemeColors {
    /** Loading text, score, timer and the prize counts on the summary screen. Default `'#ffffff'` */
    text?: string
    /** Total prize on the result screen. Default `'#3BAEDD'` */
    total?: string
}

/** A complete set of game artwork. */
export interface AngpaoRainTheme {
    /** Shown in error messages */
    name: string
    /**
     * Every game image, or a function that loads them.
     * Prefer the function (e.g. `() => import('./images').then(m => m.default)`) so the images
     * stay out of the main bundle and are only downloaded when a game is mounted.
     */
    images: AngpaoRainThemeImages | (() => Promise<AngpaoRainThemeImages>)
    /** Image of the launcher's floating button, or a function that loads it */
    launcherImage?: string | (() => Promise<string>)
    colors?: AngpaoRainThemeColors
}
