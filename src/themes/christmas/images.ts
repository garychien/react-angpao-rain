// Inlined by Vite in library mode, so this module becomes the theme's (large) lazily loaded image chunk.
import {toThemeImages} from '../toThemeImages';

export default toThemeImages(import.meta.glob<string>('./img/*.png', {eager: true, import: 'default'}));
