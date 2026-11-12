import type {AngpaoRainTheme} from '../../types';

/** Santa, gift boxes, ornaments and snowflakes. */
export const christmasTheme: AngpaoRainTheme = {
    name: 'christmas',
    images: () => import('./images').then(module => module.default),
    launcherImage: () => import('./launcher').then(module => module.default),
    colors: {text: '#ffffff', total: '#1f8a45'},
};
