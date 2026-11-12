import type {AngpaoRainTheme} from '../../types';

/** Red envelopes, gold coins and a lucky kid. Used when no `theme` is passed. */
export const defaultTheme: AngpaoRainTheme = {
    name: 'default',
    images: () => import('./images').then(module => module.default),
    launcherImage: () => import('./launcher').then(module => module.default),
    colors: {text: '#ffffff', total: '#d62839'},
};
