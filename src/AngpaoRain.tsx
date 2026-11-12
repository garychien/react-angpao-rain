import {useEffect, useRef} from 'react';

import styles from './angpao-rain.module.scss';
import {DEFAULT_LOCALE, defaultFormatAmount, defaultGameOptions, localeToArtworkLang} from './config';
import {resolveTextureUrls} from './game/assets';
import {DEFAULT_COLORS, type GameContext, reportError} from './game/context';
import {createGame} from './game/createGame';
import {defaultTheme} from './themes/default';
import type {AngpaoRainCallbacks, AngpaoRainProps} from './types';

const FONT_LOAD_TIMEOUT = 2000;

/** Phaser draws text on a canvas, so the web font has to be ready before the first scene renders */
const loadFont = async () => {
    if (typeof document === 'undefined' || !document.fonts) return;
    await Promise.race([
        Promise.all([
            document.fonts.load('24px "Plus Jakarta Sans"'),
            document.fonts.load('bold 24px "Plus Jakarta Sans"'),
        ]).catch(() => undefined),
        new Promise(resolve => setTimeout(resolve, FONT_LOAD_TIMEOUT)),
    ]);
};

/**
 * The angpao rain game. It fills its parent element (give the parent a size),
 * scaling the `width` × `height` game to fit.
 */
const AngpaoRain = ({
    locale = DEFAULT_LOCALE,
    duration = defaultGameOptions.totalTime,
    formatAmount = defaultFormatAmount,
    theme = defaultTheme,
    width = 450,
    height = 800,
    className,
    style,
    onDraw,
    onClaim,
    onClose,
    onGameOver,
    onError,
}: AngpaoRainProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const callbacksRef = useRef<AngpaoRainCallbacks>({onDraw, onClaim, onClose, onGameOver, onError});
    const formatAmountRef = useRef(formatAmount);
    const lang = localeToArtworkLang(locale);

    useEffect(() => {
        callbacksRef.current = {onDraw, onClaim, onClose, onGameOver, onError};
        formatAmountRef.current = formatAmount;
    });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const ctx: GameContext = {
            lang,
            options: {...defaultGameOptions, totalTime: Math.max(1, Math.round(duration))},
            textures: undefined as unknown as GameContext['textures'],
            themeName: theme.name,
            colors: {...DEFAULT_COLORS, ...theme.colors},
            formatAmount: value => formatAmountRef.current(value),
            callbacks: callbacksRef,
            alive: true,
        };
        let game: ReturnType<typeof createGame> | null = null;

        Promise.all([resolveTextureUrls(theme), loadFont()])
            .then(([textures]) => {
                if (!ctx.alive) return;
                ctx.textures = textures;
                game = createGame(container, ctx, width, height);
            })
            .catch(error => {
                if (!ctx.alive) return;
                reportError(ctx, error);
            });

        return () => {
            ctx.alive = false;
            game?.destroy(true);
            game = null;
        };
    }, [lang, duration, theme, width, height]);

    return (
        <div
            ref={containerRef}
            className={className ? `${styles.root} ${className}` : styles.root}
            style={style}
        />
    );
};

export default AngpaoRain;
