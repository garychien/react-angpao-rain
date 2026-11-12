import {THEME_IMAGE_SPEC} from '../themes/spec';
import type {AngpaoRainImageFile, AngpaoRainTheme, AngpaoRainThemeImages} from '../types';

/** Texture key → file name of the theme image */
export const IMAGE_FILES = {
    // loading bar (loaded first, through the PreloadScene pack)
    'loadingbar_bg': 'loadingbar_bg.png',
    'loadingbar_fill': 'loadingbar_fill.png',

    // title
    'title-coin-01': 'title-coin-01.png',
    'title-coin-02': 'title-coin-02.png',
    'title-coin-03': 'title-coin-03.png',
    'title-masthead': 'title-masthead.png',
    'title-glow': 'title-glow.png',
    'title-angpao': 'title-angpao.png',
    'title-line': 'title-line.png',

    // countdown
    'btn-mask': 'btn-mask.png',
    'button-highlight': 'button-highlight.png',
    'countdown-ready': 'countdown-ready.png',
    'countdown-01': 'countdown-01.png',
    'countdown-02': 'countdown-02.png',
    'countdown-03': 'countdown-03.png',
    'countdown-go': 'countdown-go.png',
    'countdown-angpao-num': 'countdown-angpao-num.png',
    'countdown-angpao-text': 'countdown-angpao-text.png',
    'countdown-coin-num': 'countdown-coin-num.png',
    'countdown-coin-text': 'countdown-coin-text.png',
    'countdown-line-num': 'countdown-line-num.png',
    'countdown-line-text': 'countdown-line-text.png',
    'countdown-star-num': 'countdown-star-num.png',
    'countdown-star-text': 'countdown-star-text.png',
    'countdown-blue-ring': 'countdown-blue-ring.png',
    'countdown-funnel': 'countdown-funnel.png',
    'text-time-up': 'text-time-up.png',
    'glare': 'glare_v2.png',

    // game
    'angpao': 'angpao.png',
    'plus-one': 'plus_one.png',
    'player': 'player.png',
    'player-bag': 'player-bag.png',
    'player-bag-glow': 'player-bag-glow.png',
    'player-glow': 'player-glow.png',
    'icon-score': 'icon-score.png',
    'timer-icon': 'timer-icon.png',
    'timer-bar-top': 'timer-bar-top.png',
    'timer-bar-bottom': 'timer-bar-bottom.png',
    'star-01': 'star-01.png',

    // result
    'result-box-bg': 'result-box-bg.png',
    'result-congratulations': 'result-congratulations.png',
    'result-angpao-bg': 'result-angpao-bg.png',
    'result-title': 'result-title.png',
    'result-angpao-01': 'result-angpao-01-0.png',
    'result-angpao-02': 'result-angpao-01-1.png',
    'result-angpao-03': 'result-angpao-01-2.png',
    'result-angpao-04': 'result-angpao-01-3.png',
    'result-angpao-05': 'result-angpao-02.png',
    'result-angpao-06': 'result-angpao-03.png',
    'result-angpao-07': 'result-angpao-04.png',
    'result-angpao-08': 'result-angpao-05.png',
    'result-angpao-09': 'result-angpao-06.png',
    'result-angpao-10': 'result-angpao-07.png',
    'result-angpao-11': 'result-angpao-08.png',
    'result-angpao-12': 'result-angpao-09.png',
    'result-angpao-13': 'result-angpao-10.png',
    'result-text-received-cn': 'result-text-received-cn.png',
    'result-text-received-en': 'result-text-received-en.png',

    // buttons
    'btn-receive-cn': 'btn-receive-cn.png',
    'btn-receive-en': 'btn-receive-en.png',
    'btn-start-cn': 'btn-start-cn.png',
    'btn-start-en': 'btn-start-en.png',
    'btn-close': 'btn-close.png',
} as const satisfies Record<string, AngpaoRainImageFile>;

/** Texture key → sprite sheet; the frame size comes from the spec */
export const SPRITESHEET_FILES = {
    'player-sweat': {file: 'player-sweat.png', ...THEME_IMAGE_SPEC['player-sweat.png']},
    'player-run': {file: 'player-run.png', ...THEME_IMAGE_SPEC['player-run.png']},
} as const;

export type TextureKey = keyof typeof IMAGE_FILES | keyof typeof SPRITESHEET_FILES;

/** Texture key → URL that Phaser loads */
export type TextureUrls = Record<TextureKey, string>;

/** [texture key, file name] of every texture */
export const allFiles = (): [TextureKey, AngpaoRainImageFile][] => [
    ...Object.entries(IMAGE_FILES) as [TextureKey, AngpaoRainImageFile][],
    ...Object.entries(SPRITESHEET_FILES).map(([key, sheet]) => [key, sheet.file] as [TextureKey, AngpaoRainImageFile]),
];

/** Texture key → file name, for every texture */
export const textureFileName = (key: TextureKey): AngpaoRainImageFile => {
    return key in IMAGE_FILES
        ? IMAGE_FILES[key as keyof typeof IMAGE_FILES]
        : SPRITESHEET_FILES[key as keyof typeof SPRITESHEET_FILES].file;
};

/**
 * Load the theme's image map and resolve the URL of every texture.
 * Throws when the theme lacks any image, listing the missing file names.
 */
export const resolveTextureUrls = async (theme: AngpaoRainTheme): Promise<TextureUrls> => {
    const images: Partial<AngpaoRainThemeImages> = (typeof theme.images === 'function' ? await theme.images() : theme.images) ?? {};
    const missing = allFiles().map(([, file]) => file).filter(file => !images[file]);
    if (missing.length) {
        throw new Error(`[react-angpao-rain] theme "${theme.name}" is missing ${missing.length} image(s): ${missing.join(', ')}`);
    }
    return Object.fromEntries(allFiles().map(([key, file]) => [key, images[file]])) as TextureUrls;
};
