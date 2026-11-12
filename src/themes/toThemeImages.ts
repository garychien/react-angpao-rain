import type {AngpaoRainThemeImages} from '../types';

/**
 * Turn `import.meta.glob('./img/*.png', {eager: true, import: 'default'})` (path → URL)
 * into the image map of a theme (file name → URL).
 */
export const toThemeImages = (modules: Record<string, string>): AngpaoRainThemeImages => {
    return Object.fromEntries(
        Object.entries(modules).map(([filePath, url]) => [filePath.slice(filePath.lastIndexOf('/') + 1), url]),
    ) as AngpaoRainThemeImages;
};
