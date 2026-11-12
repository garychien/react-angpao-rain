import type {ArtworkLang, GameOptions} from '../config';
import type {AngpaoRainCallbacks, AngpaoRainThemeColors} from '../types';
import type {TextureUrls} from './assets';

/** Everything the scenes of one game instance share. Replaces the old mutable static `PreloadScene.gameOptions`. */
export interface GameContext {
    lang: ArtworkLang
    options: GameOptions
    textures: TextureUrls
    /** Name of the theme, for error messages */
    themeName: string
    colors: Required<AngpaoRainThemeColors>
    formatAmount: (value: number | string) => string
    /** Kept up to date by the React component, so new callback props never restart the game */
    callbacks: {current: AngpaoRainCallbacks}
    /** False once the game has been destroyed; checked after async work */
    alive: boolean
}

export const DEFAULT_COLORS: Required<AngpaoRainThemeColors> = {text: '#ffffff', total: '#3BAEDD'};

export const SCENE = {
    preload: 'PreloadScene',
    title: 'TitleScene',
    game: 'GameScene',
    summary: 'SummaryScene',
    result: 'ResultScene',
} as const;

export const ANIM = {
    playerSweat: 'player_sweat',
    playerRunning: 'player_running',
} as const;
