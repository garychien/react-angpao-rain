import {THEME_IMAGE_SPEC} from '../themes/spec';
import {toThemeImages} from '../themes/toThemeImages';
import type {AngpaoRainImageFile, AngpaoRainTheme, AngpaoRainThemeImages} from '../types';
import {allFiles, resolveTextureUrls} from './assets';

const specFiles = Object.keys(THEME_IMAGE_SPEC) as AngpaoRainImageFile[];
const fullImages = Object.fromEntries(specFiles.map(file => [file, `/img/${file}`])) as AngpaoRainThemeImages;

describe('texture list', () => {
    it('uses every image of the spec exactly once', () => {
        const files = allFiles().map(([, file]) => file);
        expect(new Set(files).size).toBe(files.length);
        expect([...files].sort()).toEqual([...specFiles].sort());
    });
});

describe('resolveTextureUrls', () => {
    it('maps texture keys to the theme URLs', async () => {
        const textures = await resolveTextureUrls({name: 'test', images: fullImages});
        expect(textures.glare).toBe('/img/glare_v2.png');
        expect(textures['player-run']).toBe('/img/player-run.png');
    });

    it('accepts a loader function', async () => {
        const textures = await resolveTextureUrls({name: 'test', images: () => Promise.resolve(fullImages)});
        expect(textures.angpao).toBe('/img/angpao.png');
    });

    it('lists the missing files', async () => {
        const {'angpao.png': _angpao, 'plus_one.png': _plusOne, ...partial} = fullImages;
        const theme = {name: 'partial', images: partial} as unknown as AngpaoRainTheme;
        await expect(resolveTextureUrls(theme)).rejects.toThrow('theme "partial" is missing 2 image(s): angpao.png, plus_one.png');
    });
});

describe('toThemeImages', () => {
    it('keys glob results by file name', () => {
        expect(toThemeImages({'./img/angpao.png': 'data:a', '/x/y/btn-close.png': 'data:b'}))
            .toEqual({'angpao.png': 'data:a', 'btn-close.png': 'data:b'});
    });
});
